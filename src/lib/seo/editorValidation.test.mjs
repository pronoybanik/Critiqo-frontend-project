import assert from "node:assert/strict";
import test from "node:test";
import {
  parseSchemaJson,
  truncateGoogleText,
} from "./editorValidation.mjs";

test("Google preview text remains unchanged under its display limit", () => {
  assert.equal(truncateGoogleText("Short title", 60), "Short title");
});

test("Google preview text truncates and adds an ellipsis over its limit", () => {
  const text = "x".repeat(70);
  assert.equal(truncateGoogleText(text, 60), `${"x".repeat(57)}…`);
});

test("schema JSON parses objects before submission", () => {
  assert.deepEqual(parseSchemaJson('{"@type":"Article"}'), {
    "@type": "Article",
  });
});

test("invalid schema JSON exposes a readable parse error", () => {
  assert.throws(
    () => parseSchemaJson('{"@type":'),
    SyntaxError,
  );
});
