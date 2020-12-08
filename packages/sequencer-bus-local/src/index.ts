import { createLocalMessageBus, MessageBus } from "sequencer-bus";

const requestBus: MessageBus = createLocalMessageBus();
const responseBus: MessageBus = createLocalMessageBus();

export {
    requestBus,
    responseBus,
}