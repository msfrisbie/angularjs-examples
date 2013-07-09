# $digest()

This is intended to demonstrate how digest works inside the AngularJS runtime.

### $apply()

`$apply()` is used to execute an expression in angular from outside of the angular framework. (For example from browser DOM events, setTimeout, XHR or third party libraries).The AngularJS 1.1.5 source code for `$apply()` is as follows:

```javascript
$apply: function(expr) {
  try {
    beginPhase('$apply');
    return this.$eval(expr);
  } catch (e) {
    $exceptionHandler(e);
  } finally {
    clearPhase();
    try {
      $rootScope.$digest();
    } catch (e) {
      $exceptionHandler(e);
      throw e;
    }
  }
}
```

After evaluating the `expr` parameter and handling exceptions thrown by it, `$apply` invokes `$rootScope.$digest()`. This 'digest loop' cycles through the $evalAsync queue and the $watch list until the DOM is stabilized.

Note: As detailed in the docs, it is possible to register a $watch on all $digest calls by passing it a single parameter, the callback function. The callback executes on all $digest invocations application-wide.

### Walkthrough of the Example

In this example, we can gain some insight into when $digest is called.

Open the application with a browser console and give it a moment to run.

After the config finishes, the controller will obviously be instantiated.

Inside the controller, we declare a variable and a function, which are not of interest at this time. We also register a $watch on all $digest calls, and set a $timeout.

In the console, notice that $digest has been invoked twice. Both are due to the $watch listener being registered.

When the timeout eventually executes, it will invoke `make_request()`, which contains an $http request. When the $timeout finishes, notice that $digest occurs 2 more times. Both XHRs and $timeout actions will invoke $digest when they complete.

Additionally, we can see that clicking the `<button>` will invoke $digest. `ng-click`, though not formally tied to anything, invokes $digest.

Finally, entering text in the `<input>` will also invoke $digest. In AngularJS, because of the implementation of data-binding, the model can be treated as the 'single-source-of-truth' in the application, and so whenever the model is modified (as is done here), $digest must be invoked to propagate and possible changes throughout the application or views.
