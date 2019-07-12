module.exports = {
  components: {
    categories: [
      {
        name: 'General',
        include: [
          'src/components/button/Button.vue',
        ]
      }
    ],
    plugins: {
      serialization: (componentInfo) => {
        console.log(componentInfo);
        return Promise.resolve({
          result: {
            name: 'Button',
            properties: [],
          },
          warnings: [],
        });
      },
    },
  },
  name: 'Buefy {Merge}',
};
