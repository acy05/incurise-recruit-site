export const MAX_RECRUIT_FILE_BYTES = 5 * 1024 * 1024;

export type RecruitApplication = {
  name: string;
  kana: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  resume: File;
  workHistory: File;
  otherDocument?: File;
};

export type Wpcf7FieldError = {
  field: string;
  message: string;
};

export type RecruitSubmissionResult =
  | { ok: true; message: string }
  | { ok: false; kind: "validation" | "spam" | "mail" | "network" | "configuration"; message: string; invalidFields?: Wpcf7FieldError[] };

type Wpcf7Response = {
  status?: string;
  message?: string;
  invalid_fields?: Array<{ field?: string; message?: string }>;
};

const recruitEndpointPattern = /^\/wp-json\/contact-form-7\/v1\/contact-forms\/(\d+)\/feedback\/?$/;

export type RecruitEndpoint = {
  url: string;
  formId: string;
};

export function parseRecruitEndpoint(endpoint?: string): RecruitEndpoint | null {
  if (!endpoint) return null;
  try {
    const url = new URL(endpoint.trim());
    const match = url.pathname.match(recruitEndpointPattern);
    if (
      url.protocol !== "https:" ||
      url.hostname !== "incurise.co.jp" ||
      url.port ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      !match ||
      Number(match[1]) < 1
    ) return null;
    return { url: url.toString(), formId: match[1] };
  } catch {
    return null;
  }
}

const fieldNames: Record<keyof Omit<RecruitApplication, "otherDocument"> | "otherDocument", string> = {
  name: "applicant-name",
  kana: "applicant-kana",
  birthYear: "birth-year",
  birthMonth: "birth-month",
  birthDay: "birth-day",
  gender: "gender",
  phone: "tel",
  email: "email",
  address: "address",
  resume: "resume",
  workHistory: "work-history",
  otherDocument: "other-document",
};

export function buildRecruitFormData(application: RecruitApplication, turnstileToken: string, formId: string) {
  const body = new FormData();
  body.append("_wpcf7_unit_tag", `wpcf7-f${formId}-o1`);
  body.append(fieldNames.name, application.name);
  body.append(fieldNames.kana, application.kana);
  body.append(fieldNames.birthYear, application.birthYear);
  body.append(fieldNames.birthMonth, application.birthMonth);
  body.append(fieldNames.birthDay, application.birthDay);
  body.append(fieldNames.gender, application.gender);
  body.append(fieldNames.phone, application.phone);
  body.append(fieldNames.email, application.email);
  body.append(fieldNames.address, application.address);
  body.append(fieldNames.resume, application.resume, application.resume.name);
  body.append(fieldNames.workHistory, application.workHistory, application.workHistory.name);
  if (application.otherDocument) {
    body.append(fieldNames.otherDocument, application.otherDocument, application.otherDocument.name);
  }
  body.append("privacy-consent", "1");
  body.append("_wpcf7_turnstile_response", turnstileToken);
  return body;
}

export async function submitRecruitApplication(
  application: RecruitApplication,
  turnstileToken: string,
  endpoint = import.meta.env.VITE_RECRUIT_WPCF7_ENDPOINT,
): Promise<RecruitSubmissionResult> {
  const recruitEndpoint = parseRecruitEndpoint(endpoint);
  if (!recruitEndpoint) {
    return { ok: false, kind: "configuration", message: "応募受付の設定を確認しています。現在は入力内容の確認まで利用できます。" };
  }
  if (!turnstileToken) {
    return { ok: false, kind: "configuration", message: "セキュリティ確認を完了してください。" };
  }

  const controller = new AbortController();
  // Three accepted PDFs can total 15 MB before multipart overhead. Give slower
  // upstream connections and the WordPress mail hand-off enough time to finish
  // so a successful server-side submission is not mistaken for a client retry.
  const timeout = globalThis.setTimeout(() => controller.abort(), 180_000);
  try {
    const response = await fetch(recruitEndpoint.url, {
      method: "POST",
      body: buildRecruitFormData(application, turnstileToken, recruitEndpoint.formId),
      headers: { Accept: "application/json" },
      redirect: "error",
      signal: controller.signal,
    });
    const payload = (await response.json().catch(() => ({}))) as Wpcf7Response;
    const message = payload.message || "応募を送信できませんでした。時間をおいて再度お試しください。";

    if (response.ok && payload.status === "mail_sent") {
      return { ok: true, message };
    }
    if (payload.status === "validation_failed") {
      return {
        ok: false,
        kind: "validation",
        message,
        invalidFields: (payload.invalid_fields ?? []).flatMap((item) => item.field && item.message ? [{ field: item.field, message: item.message }] : []),
      };
    }
    if (payload.status === "acceptance_missing") {
      return {
        ok: false,
        kind: "validation",
        message,
        invalidFields: [{ field: "privacy-consent", message }],
      };
    }
    if (payload.status === "spam") return { ok: false, kind: "spam", message };
    if (payload.status === "mail_failed" || payload.status === "aborted") return { ok: false, kind: "mail", message };
    return { ok: false, kind: "network", message };
  } catch {
    return { ok: false, kind: "network", message: "通信に失敗しました。接続を確認して、もう一度お試しください。" };
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

export const wpcf7FieldToFormField: Record<string, string> = Object.fromEntries(
  Object.entries(fieldNames).map(([key, value]) => [value, key]),
);
wpcf7FieldToFormField["privacy-consent"] = "privacy";
