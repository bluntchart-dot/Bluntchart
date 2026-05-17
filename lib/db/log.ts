/** Consistent server logs for checkout / webhook / reading flows. */
export function dbLog(
  scope: string,
  message: string,
  extra?: Record<string, unknown>
) {
  const prefix = `[bluntchart/db/${scope}]`;
  if (extra) {
    console.log(prefix, message, extra);
  } else {
    console.log(prefix, message);
  }
}

export function dbError(
  scope: string,
  message: string,
  error: unknown,
  extra?: Record<string, unknown>
) {
  const prefix = `[bluntchart/db/${scope}]`;
  console.error(prefix, message, {
    error:
      error && typeof error === "object" && "message" in error
        ? (error as { message: string }).message
        : String(error),
    ...(extra ?? {}),
  });
}
