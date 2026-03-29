import { describe, expect, test } from "vitest"
import { SUPPORTED_IMAGE_TYPES } from "./AttachmentPlugin"

describe("AttachmentPlugin", () => {
  test("rejects SVG uploads", () => {
    expect(SUPPORTED_IMAGE_TYPES).not.toContain("image/svg+xml")
  })
})
