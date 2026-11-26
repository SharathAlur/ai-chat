export async function* readTextStream(res: Response) {
  if (!res.body) {
    throw new Error("Invalid Body");
  }
  const decoder = new TextDecoder();
  const reader = res.body.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        const rest = decoder.decode(value);
        if (rest) yield rest;
        break;
      }
      yield decoder.decode(value, { stream: true });
    }
  } catch (e) {
    console.error("error our" + e);
  } finally {
    reader.releaseLock();
  }
}
