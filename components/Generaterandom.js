export default function Random() {
  // Function to generate a random string
  function generateRandomString(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  // Generate a random number between 0 (inclusive) and 10 (exclusive)
  let randomNumber = Math.random() * 10;

  // Generate a random string of length 5
  let randomString = generateRandomString(5);

  // Concatenate the random number and random string
  let randomResult = randomNumber.toString() + randomString;

  console.log(randomResult);
  return randomResult;
}
