import { phone_number } from "./phone-number.mjs";

const accept_list = [
  "079 123 45 67",
  "0791234567",
  "+41 79 123 45 67",
  "+41791234567",
  "0041 79 123 45 67",
  "+41 (0)79 123 45 67",
  "022 345 67 89",
  "079.123.45.67",
  "079-123-45-67",
  "079/123 45 67",
  "+33 6 12 34 56 78",
  "+39 06 1234 5678",
  "+49 30 1234567",
];

const reject_list = [
  "CH",
  "abc",
  "079 abc 45 67",
  "12345",
  "+41",
  "0000000000",
  "079 123 45 67 89 12 34",
  "",
];

const verdict = (input) => {
  const parsed = phone_number.safeParse(input);
  if (parsed.success) return `${input} | accepted`;
  return `${input} | rejected | ${parsed.error.issues[0].message}`;
};

for (const input of [...accept_list, ...reject_list]) {
  process.stdout.write(`${verdict(input)}\n`);
}
