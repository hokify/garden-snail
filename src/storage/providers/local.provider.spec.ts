import fs from "fs/promises";
import path from "path";
import { Readable } from "stream";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { LocalStorageService } from "./local.provider";

describe("LocalStorageService", () => {
  let localStorageService: LocalStorageService;
  const team = "testteam";

  beforeAll(() => {
    localStorageService = new LocalStorageService();
  });

  afterAll(() => {
    fs.rm(path.join("blobs", team), {
      recursive: true,
      force: true,
    });
  });

  describe("write", () => {
    const hash = "writehash";

    it("should write out the received data to a file", async () => {
      const content = Buffer.from("test content");
      await localStorageService.write(team, hash, Readable.from(content));
      expect(await fs.readFile(path.join("blobs", team, hash))).toEqual(
        content,
      );
    });
  });

  describe("exists", () => {
    const hash = "existshash";

    beforeAll(() => {
      fs.writeFile(path.join("blobs", team, hash), "test content");
    });

    it("should return true if the given file exists", async () => {
      await expect(localStorageService.exists(team, hash)).resolves.toEqual(
        true,
      );
    });

    it("should return false if the given file doesn't exist", async () => {
      await expect(
        localStorageService.exists(team, "wronghash"),
      ).resolves.toEqual(false);
    });
  });

  describe("read", () => {
    const hash = "readhash";
    const content = "test content";

    beforeAll(() => {
      fs.writeFile(path.join("blobs", team, hash), content);
    });

    it("should return the contents", async () => {
      const result = await localStorageService.read(team, hash);
      let receivedContent = "";
      for await (const data of result) receivedContent += data;
      expect(receivedContent).toEqual(content);
    });
  });
});
