import { fetchImageByImage, SIZE_PORTRAIT } from "./fetchImageByImage.js";

if (Deno.args.length == 0) {
  console.log("img2img [prompt] [imagefn]");
  Deno.exit(1);
}

const loadFile = async (fn) => {
  if (fn.startsWith("http://") || fn.startsWith("https://")) {
    return await (await fetch(fn)).bytes();
  }
  return await Deno.readFile(fn);
};

const prompt = Deno.args[0];
const imgfn = Deno.args[1];
const src = await loadFile(imgfn);
const bin = await fetchImageByImage(prompt, src, { size: SIZE_PORTRAIT });
await Deno.writeFile(prompt.replace(/ /g, "_") + ".png", bin);
