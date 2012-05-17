define([ 'use!underscore' ], function(_) {
  describe("functions", function() {
    var sayIt = function(greeting, name, punctuation) {
          return greeting + ', ' + name + (punctuation || '!');
        };


    it("you should be able to use an array as arguments when calling a function", function() {
      var fn = function(args) {
          return sayIt.apply(this,args);
      };

      var result = fn([ 'Hello', 'Ellie', '!' ]);
      expect(result).to.be('Hello, Ellie!');
    });

    it("you should be able to change the context in which a function is called", function() {
      var speak = function() {
            return sayIt(this.greeting, this.name, '!!!');
          },
          obj = {
            greeting : 'Hello',
            name : 'Rebecca'
          };

      // define a function for fn that calls the speak function such that the
      // following test will pass
      var fn = function() {
        return speak.apply(obj);
      };

      expect(fn()).to.be('Hello, Rebecca!!!');
    });

    it("you should be able to return a function from a function", function() {
      // define a function for fn so that the following will pass

      var fn = function(greeting) {
        var innerFn = function(name){
              return greeting + ", " + name;
        }
        return innerFn;
      }

     // expect(fn('Hello')('world')).to.be('Hello, world');

      var greetWithHello = fn('Hello');
      expect(greetWithHello("world")).to.be('Hello, world')

    });

    it("you should be able to create a 'partial' function", function() {
      // define a function for fn so that the following will pass

      var fn = function(toCall, greeting, name){
          var sayItWithPunctuation = function(punctuation){
              return toCall(greeting, name, punctuation);
          }
          return sayItWithPunctuation;
      }

      var partial = fn(sayIt, 'Hello', 'Ellie');
      expect(partial('!!!')).to.be('Hello, Ellie!!!');
    });

    it("you should be able to use arguments", function () {
      var fn = function () {
       // var reduce = Array.prototype.reduce;
       // return reduce.call(arguments,function(previousValue, currentValue, index, array){  
         // return previousValue + currentValue;  
        //});
        var sum = 0;
        for (var i = arguments.length - 1; i >= 0; i--) {
          sum += arguments[i]
        };
        return sum;
      };

      var a = 1, b = 2, c = 3, d = 4;
      
      expect(fn(a)).to.be(a);
      expect(fn(a, b)).to.be(a + b);
      expect(fn(a, b, c)).to.be(a + b + c);
      expect(fn(a, b, c, d)).to.be(a + b + c + d);
    });

    it("you should be able to apply functions", function () {
      var fn = function (fun) {
        // you can only edit function body here
        var funArgs = Array.prototype.slice.call(arguments, 1);
        fun.apply(this, funArgs);
      };

      (function () {
        var a = Math.random(), b = Math.random(), c = Math.random();

        var wasITake2ArgumentsCalled = false;
        var iTake2Arguments = function (firstArgument, secondArgument) {
          expect(arguments.length).to.be(2);
          expect(firstArgument).to.be(a);
          expect(secondArgument).to.be(b);

          wasITake2ArgumentsCalled = true;
        };

        var wasITake3ArgumentsCalled = false;
        var iTake3Arguments = function (firstArgument, secondArgument, thirdArgument) {
          expect(arguments.length).to.be(3);
          expect(firstArgument).to.be(a);
          expect(secondArgument).to.be(b);
          expect(thirdArgument).to.be(c);

          wasITake3ArgumentsCalled = true;
        };

        fn(iTake2Arguments, a, b);
        fn(iTake3Arguments, a, b, c);
        expect(wasITake2ArgumentsCalled).to.be.ok();
        expect(wasITake3ArgumentsCalled).to.be.ok();
      })();
    });

    it("you should be able to curry existing functions", function () {
      var fn = function (fun) {
        var argsToCurry = Array.prototype.slice.call(arguments, 1);

        return function(){
          var innerArgs = Array.prototype.slice.call(arguments, 0);
          Array.prototype.push.apply(argsToCurry, innerArgs);
          
          return fun.apply(null, argsToCurry);
        };
      };

      var curryMe = function (x, y, z) {
        return x / y * z;
      };

      var a = 1, b = 2, c = 3;
      expect(fn(curryMe)(a, b, c)).to.be(curryMe(a, b, c));
      expect(fn(curryMe, a)(b, c)).to.be(curryMe(a, b, c));
      expect(fn(curryMe, a, b)(c)).to.be(curryMe(a, b, c));
      expect(fn(curryMe, a, b, c)()).to.be(curryMe(a, b, c));
      expect(fn(curryMe, a, b, c)()).to.be(curryMe(a, b, c));
      expect(fn(curryMe, b, a, c)()).to.be(curryMe(b, a, c));
    });

    it('you should be able to use closures', function () {
      var arr = [ Math.random(), Math.random(), Math.random(), Math.random() ];
      var doSomeStuff;

      var fn = function (vals) {
        // you can only edit function body here
        return vals.map(function(item){
           return function(){
            return doSomeStuff(item);
          };
        });
      };
      

      doSomeStuff = function (x) { return x * x; };

      var funcs = fn(arr);
      expect(funcs).to.have.length(arr.length);
      for (var i = funcs.length - 1; i >= 0; i--) {
        expect(funcs[i]()).to.be(doSomeStuff(arr[i]));
      };
    });
  });
});
