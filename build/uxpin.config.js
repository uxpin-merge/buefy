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
      },
    },
  },
  name: 'Buefy {Merge}',
};
