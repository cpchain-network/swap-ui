import dev from "./chainDev";
import prod from "./chainProd";
console.log(import.meta.env.VITE_MODE);

export default {
  ...(import.meta.env.VITE_MODE === "production" ? prod : dev),
}