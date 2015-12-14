var test = require('unit.js');
var objectutil = require("../core/util/object-util");

var obj1 = {
  prop1: true,
  prop3: [1, 2, 3, 4],
  prop5: "test",
  prop10: { name: "Tester" }
};

var obj2 = {
  prop2: false,
  prop4: "This is a test",
  prop6: { name: "Other" },
  prop10: [5, 4, 3, 2, 1]
}

describe('Testing Object Merge', function(){
  describe('With Object And Null', function(){
    it("should return the object when null combined with it", function () {
      test.object(objectutil.mergeObjects(obj1, null)).is(obj1);
    });

    it("should return the object when it is combined with null", function () {
      test.object(objectutil.mergeObjects(null, obj2)).is(obj2);
    });
  });
  
  describe('With Two Objects', function() {
    
    it("Should override with obj2 properties", function () {
      test.object(objectutil.mergeObjects(obj1, obj2))
        .hasProperty('prop1', obj1.prop1)
        .hasProperty('prop3', obj1.prop3)
        .hasProperty('prop5', obj1.prop5)
        .hasProperty('prop10', obj2.prop10)
        .hasProperty('prop2', obj2.prop2)
        .hasProperty('prop4', obj2.prop4)
        .hasProperty('prop6', obj2.prop6);
    });
    
    it("Should override with obj1 properties", function () {
      test.object(objectutil.mergeObjects(obj2, obj1))
        .hasProperty('prop1', obj1.prop1)
        .hasProperty('prop3', obj1.prop3)
        .hasProperty('prop5', obj1.prop5)
        .hasProperty('prop10', obj1.prop10)
        .hasProperty('prop2', obj2.prop2)
        .hasProperty('prop4', obj2.prop4)
        .hasProperty('prop6', obj2.prop6);
    });
  })
});