import "next/dist/server/node-environment-baseline";
import { AfterRunner } from "next/dist/server/after/run-with-after";
import { workAsyncStorage } from "next/dist/server/app-render/work-async-storage.external";
import { workUnitAsyncStorage } from "next/dist/server/app-render/work-unit-async-storage.external";
import { createRequestStore } from "next/dist/server/async-storage/request-store";
import { createWorkStore } from "next/dist/server/async-storage/work-store";
import { after as after_response } from "next/server";
import { describe, expect, it, vi } from "vitest";

const create_stores = (runner: AfterRunner) => {
  const work_store = createWorkStore({
    page: "/page",
    buildId: "test-build",
    deploymentId: "",
    previouslyRevalidatedTags: [],
    renderOpts: {
      supportsDynamicResponse: true,
      isPossibleServerAction: true,
      staticPageGenerationTimeout: 60,
      cacheLifeProfiles: { default: { stale: 0, revalidate: 0, expire: 0 } },
      cacheComponents: false,
      validationLevel: "warning",
      experimental: { authInterrupts: false, useCacheTimeout: 50_000 },
      waitUntil: runner.context.waitUntil,
      onClose: runner.context.onClose,
      onAfterTaskError: runner.context.onTaskError,
    },
  });
  const work_unit_store = createRequestStore({
    phase: "action",
    headers: new Headers(),
    onUpdateCookies: undefined,
    url: { pathname: "/" },
    rootParams: {},
    implicitTags: { tags: [], expirationsByCacheKind: new Map() },
    resumeDataCache: null,
    previewProps: undefined,
    isHmrRefresh: undefined,
    serverComponentsHmrCache: undefined,
    hmrRefreshHash: undefined,
    fallbackParams: null,
  });
  return { work_store, work_unit_store };
};

const yield_to_event_loop = () =>
  new Promise<void>((resolve) => {
    setImmediate(resolve);
  });

describe("after", () => {
  it("keeps the second task running once the response closes when the first one rejects", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const runner = new AfterRunner();
    const { work_store, work_unit_store } = create_stores(runner);
    const first_error = new Error("first task fails");
    const ran: string[] = [];

    const schedule_both_tasks = () =>
      workAsyncStorage.run(work_store, () =>
        workUnitAsyncStorage.run(work_unit_store, () => {
          after_response(async () => {
            throw first_error;
          });
          after_response(async () => {
            ran.push("second");
          });
        }),
      );
    expect(schedule_both_tasks).not.toThrow();

    await yield_to_event_loop();
    expect(ran).toEqual([]);
    expect(work_unit_store.phase).toBe("action");
    expect(error).not.toHaveBeenCalled();

    await expect(runner.executeAfter()).rejects.toBe(first_error);

    expect(ran).toEqual(["second"]);
    expect(work_unit_store.phase).toBe("after");
    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining("after()"),
      first_error,
    );
    error.mockRestore();
  });
});
