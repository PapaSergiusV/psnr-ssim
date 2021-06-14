export const createGenerator = () => {
  let i = 0;
  return () => ++i;
}
