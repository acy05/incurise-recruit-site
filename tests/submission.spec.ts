import { expect, test } from "@playwright/test";
import { buildRecruitFormData, parseRecruitEndpoint, submitRecruitApplication, type RecruitApplication } from "../src/recruitSubmission";

const endpoint = "https://incurise.co.jp/wp-json/contact-form-7/v1/contact-forms/42/feedback";

function pdf(name: string) {
  return Object.assign(new Blob(["%PDF-1.4"], { type: "application/pdf" }), { name }) as File;
}

function application(): RecruitApplication {
  return {
    name: "山田 太郎",
    kana: "やまだ たろう",
    birthYear: "1990",
    birthMonth: "4",
    birthDay: "15",
    gender: "回答しない",
    phone: "090-1234-5678",
    email: "taro@example.com",
    address: "東京都港区三田1-3-33",
    resume: pdf("resume.pdf"),
    workHistory: pdf("work-history.pdf"),
    otherDocument: pdf("portfolio.pdf"),
  };
}

test("CF7 multipart payload includes files, consent and Turnstile token", () => {
  const body = buildRecruitFormData(application(), "turnstile-token", "42");
  expect(body.get("_wpcf7_unit_tag")).toBe("wpcf7-f42-o1");
  expect(body.get("applicant-name")).toBe("山田 太郎");
  expect(body.get("applicant-kana")).toBe("やまだ たろう");
  expect(body.get("birth-year")).toBe("1990");
  expect(body.get("birth-month")).toBe("4");
  expect(body.get("birth-day")).toBe("15");
  expect(body.get("gender")).toBe("回答しない");
  expect(body.get("tel")).toBe("090-1234-5678");
  expect(body.get("email")).toBe("taro@example.com");
  expect(body.get("address")).toBe("東京都港区三田1-3-33");
  expect((body.get("resume") as File).name).toBe("resume.pdf");
  expect((body.get("work-history") as File).name).toBe("work-history.pdf");
  expect((body.get("other-document") as File).name).toBe("portfolio.pdf");
  expect(body.get("privacy-consent")).toBe("1");
  expect(body.get("_wpcf7_turnstile_response")).toBe("turnstile-token");

  const withoutOptional = application();
  delete withoutOptional.otherDocument;
  expect(buildRecruitFormData(withoutOptional, "token", "42").get("other-document")).toBeNull();
});

test("CF7 mail_sent succeeds", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (_input, init) => {
    expect(init?.redirect).toBe("error");
    return new Response(JSON.stringify({ status: "mail_sent", message: "送信しました" }), { status: 200, headers: { "content-type": "application/json" } });
  };
  try {
    await expect(submitRecruitApplication(application(), "token", endpoint)).resolves.toEqual({ ok: true, message: "送信しました" });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("CF7 validation, spam, mail and network failures are returned to the UI", async () => {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async () => new Response(JSON.stringify({ status: "validation_failed", message: "入力を確認してください", invalid_fields: [{ field: "email", message: "メール形式を確認してください" }] }), { status: 200 });
    const validation = await submitRecruitApplication(application(), "token", endpoint);
    expect(validation).toMatchObject({ ok: false, kind: "validation", invalidFields: [{ field: "email" }] });

    globalThis.fetch = async () => new Response(JSON.stringify({ status: "spam", message: "スパムとして判定されました" }), { status: 200 });
    await expect(submitRecruitApplication(application(), "token", endpoint)).resolves.toMatchObject({ ok: false, kind: "spam" });

    globalThis.fetch = async () => new Response(JSON.stringify({ status: "mail_failed", message: "メール送信に失敗しました" }), { status: 200 });
    await expect(submitRecruitApplication(application(), "token", endpoint)).resolves.toMatchObject({ ok: false, kind: "mail" });

    globalThis.fetch = async () => { throw new Error("offline"); };
    await expect(submitRecruitApplication(application(), "token", endpoint)).resolves.toMatchObject({ ok: false, kind: "network" });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("submission fails closed without endpoint or token", async () => {
  await expect(submitRecruitApplication(application(), "token", "")).resolves.toMatchObject({ ok: false, kind: "configuration" });
  await expect(submitRecruitApplication(application(), "", endpoint)).resolves.toMatchObject({ ok: false, kind: "configuration" });
  await expect(submitRecruitApplication(application(), "token", "https://evil.example/feedback")).resolves.toMatchObject({ ok: false, kind: "configuration" });
});

test("only the dedicated HTTPS CF7 endpoint is accepted", () => {
  expect(parseRecruitEndpoint(endpoint)).toEqual({ url: endpoint, formId: "42" });
  expect(parseRecruitEndpoint("http://incurise.co.jp/wp-json/contact-form-7/v1/contact-forms/42/feedback")).toBeNull();
  expect(parseRecruitEndpoint("https://incurise.co.jp:444/wp-json/contact-form-7/v1/contact-forms/42/feedback")).toBeNull();
  expect(parseRecruitEndpoint("https://incurise.co.jp/wp-json/contact-form-7/v1/contact-forms/0/feedback")).toBeNull();
  expect(parseRecruitEndpoint("https://incurise.co.jp/wp-json/contact-form-7/v1/contact-forms/{FORM_ID}/feedback")).toBeNull();
  expect(parseRecruitEndpoint("https://incurise.co.jp/wp-json/contact-form-7/v1/contact-forms/42/feedback?next=evil")).toBeNull();
});

test("CF7 acceptance_missing maps to the privacy field", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ status: "acceptance_missing", message: "同意が必要です" }), { status: 200 });
  try {
    await expect(submitRecruitApplication(application(), "token", endpoint)).resolves.toMatchObject({
      ok: false,
      kind: "validation",
      invalidFields: [{ field: "privacy-consent" }],
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});
