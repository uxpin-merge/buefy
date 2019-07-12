var vueDocs = require('vue-docgen-api')
var _ = require('lodash');

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
        const parsedComponent = vueDocs.parse(componentInfo.path);
        return Promise.resolve({
          result: {
            name: parsedComponent.displayName,
            properties: serializeProperties(parsedComponent.props),
          },
          warnings: [],
        });
      },
    },
  },
  name: 'Buefy {Merge}',
};


const serializeProperties = (props) => {
  return _.map(props, serializeProperty)
  /*return {
    defaultValue?:PropertyDefaultValue;
  description:string;
  isRequired:boolean;
  name:string;
  type?:PropertyType;
  }*/
}

const serializeProperty = (value, prop) => {
  return {
    isRequired: !!_.get(value, 'isRequired', false),
    name: prop,
    type: value.type.name.includes('|') ? 'string' : _.get(value, 'type.name'),
  }
}
