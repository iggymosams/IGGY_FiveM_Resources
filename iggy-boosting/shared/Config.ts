export const Config = {
    DEBUG: false,
    TIME_BETWEEN_CONTRACTS: 30,
    CONTRACT_CHANCE: 70,
    DEFAULT_BLIP_DELAY: 30,
    POLICE_JOB: "police",
    HACK_COOLDOWN: 1,
    MAX_FAILED: {
        ["C"]: 0,
        ["B"]: 5,
        ["A"]: 3,
    },
    HACKS: {
        ["C"]: 0,
        ["B"]: 10,
        ["A"]: 20,
    },
    BOOST_PRICE: {
        ["C"]: { min: 0, max: 5 },
        ["B"]: { min: 5, max: 10 },
        ["A"]: { min: 10, max: 20 },
    },
    REP_REWARD: {
        ["C"]: { min: 1, max: 2 },
        ["B"]: { min: 1, max: 3 },
        ["A"]: { min: 2, max: 4 },
    },
    MAX_PLAYERS: {
        ["C"]: { min: -1, max: -1 },
        ["B"]: { min: 2, max: 2 },
        ["A"]: { min: 2, max: 4 },
    },
};
