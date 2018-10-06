const pageData = {
  data: { title: 'hi' },
  componentName: "dashboard",
  isLegacy: true
}

const resolvers = {
  Query: {
    router: (_, { path }) => JSON.stringify(pageData),
    dashboardPage: (_, {}) => ({
      incidents: [{ name: 'This site is broken' }]
    })
  },
};

export default resolvers;
