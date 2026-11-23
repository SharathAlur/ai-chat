export async function* fakeStream(text: string) {
  console.log(text);
  // TODO: split text into words
  const words = text.split(" ");
  // TODO: for each word:
  //         wait ~80ms   (hint: await new Promise(r => setTimeout(r, 80)))
  //         yield the word plus a space
  for (const word of words) {
    await new Promise((resolve) => setTimeout(resolve, 80));
    yield word + " ";
  }
}
