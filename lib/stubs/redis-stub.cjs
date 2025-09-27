module.exports = {
  createClient() {
    return {
      on() {},
      connect: async () => {},
      incr: async () => 1,
      expire: async () => {},
      quit: async () => {},
    };
  }
};
