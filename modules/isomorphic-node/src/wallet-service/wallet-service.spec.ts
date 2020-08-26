import { container } from "tsyringe";
import { Allocation } from "@statechannels/client-api-schema";
import { Participant, makeDestination } from "@statechannels/wallet-core";
import { describe } from "mocha";

import {
  expect,
  mkAddress,
  mkPublicIdentifier,
  MockMessagingService,
  MockConfigService,
  MockWallet,
} from "../test";
import { WalletService } from ".";
import { INJECTION_TOKEN } from "../constants";
import { ConfigService } from "../config";

describe("WalletService", () => {
  let walletService: WalletService;
  beforeEach(() => {
    container.register(INJECTION_TOKEN.MESSAGING_SERVICE, {
      useClass: MockMessagingService,
    });
    container.register(INJECTION_TOKEN.WALLET, { useValue: new MockWallet() });
    container.register(ConfigService, { useClass: MockConfigService });
    walletService = container.resolve(WalletService);
  });

  afterEach(() => {
    container.reset();
  });

  it("should create a channel", async () => {
    const testParticipant: Participant = {
      destination: makeDestination(mkAddress("0xbad")),
      participantId: mkPublicIdentifier("indratest"),
      signingAddress: mkAddress("0xbad"),
    };
    const result = await walletService.createChannel(testParticipant);
    expect(result.allocations.length).to.be.eq(2);
    expect(result.allocations[0]).to.deep.eq({} as Allocation);
  });
});