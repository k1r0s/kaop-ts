export default (function(){
  const META_KEY = "##meta";
  return {
    defineMetadata: function(target, key, prop) {
      if(!target[META_KEY]) target[META_KEY] = {};

      target[META_KEY][key] = prop;
    },
    getMetadata: function(target, key) {
      return target[META_KEY] && target[META_KEY][key];
    }
  }
})() as any;
