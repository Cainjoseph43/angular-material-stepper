/**
 * @ngdoc directive
 * @name kdsStepper
 * @description
 * The directive `<kds-stepper>` serves as the container for `<kds-step>` child directives to produces a Stepper component.
 *
 * Below is the markup for its simplest usage:
 *
 *  <hljs lang="html">
 *  <kds-stepper>
 *    <kds-step label="Tab #1"></kds-step>
 *    <kds-step label="Tab #2"></kds-step>
 *    <kds-step label="Tab #3"></kds-step>
 *  </kds-stepper>
 *  </hljs>
 *
 *  @param {=string} kds-orientation Stepper orientation
 */
angular
  .module('kds.stepper')
  .directive('kdsStepper', KdsStepper);

function KdsStepper($mdTheming, $compile) {
  return {
    scope:            {
      currentStep: '='
    },
    restrict:         'EA',
    controller:       'KdsStepperController',
    controllerAs:     '$kdsStepperCtrl',
    bindToController: true,
    terminal:         true,
    template:         function (elem, attr) {
      var steps      = elem.children();
      attr.$kdsSteps = steps;
      return '' +
        '<kds-steps-wrapper layout="{{$kdsStepperCtrl.orientation}}"> </kds-steps-wrapper>' +
        '<kds-steps-content>' +
        '<kds-step ng-if="$kdsStepperCtrl.checkPage($index)" ng-repeat="step in $kdsStepperCtrl.steps"></kds-step>' +
        '</kds-steps-content>';
    },
    link:             function (scope, elem, attr, controller, transclude) {
      var stepper   = elem.contents(),
          templates = attr.$kdsSteps,
          steps     = [],
          label, template;

      for (var i = 0; i < templates.length; i++) {
        label = templates[i].getAttribute('label');
        templates[i].removeAttribute('label');
        template = templates[i];
        steps.push({
          label: label,
          elem:  template,
        });
      }
      controller.steps = steps;
      $compile(stepper)(scope);
    }
  }
}
KdsStepper.$inject = ['$mdTheming', '$compile'];


/**
 * @ngdoc directive
 * @name kdsStepsWrapper
 * @description
 * The wrapper for the steps pagination
 * @restrict E
 */
angular.module('kds.stepper')
  .directive('kdsStepsWrapper', KdsStepperWrapper);

function KdsStepperWrapper() {
  return {
    restrict: 'E',
    require:  '^kdsStepper',
    template: function () {
      return '' +
        '<kds-step-item flex layout="row" layout-align="center center" ng-repeat="step in $kdsStepperCtrl.steps" ' +
        'ng-disabled="$kdsStepperCtrl.isDisabled(this)" kds-step-done="true" ng-click="$kdsStepperCtrl.nextStepItem($event, this)"' +
        'ng-class="{active: $index == $kdsStepperCtrl.currentStep, disabled: $index > $kdsStepperCtrl.currentStep+1}" md-ink-ripple="#aaa">' +
        '<md-button flex="none" class="md-fab md-mini md-primary"  md-no-ink  aria-label="{{step.attrs.kdsLabel}}"' +
        'ng-disabled="$kdsStepperCtrl.isDisabled(this)">' +
        '<md-icon md-svg-icon="md-done" ng-show="step.done"></md-icon> <span ng-show="!step.done">{{ ($index + 1) }}</span> ' +
        '</md-button>' +
        '<span flex="none"> {{ step.label ||  $kdsStepperCtrl.stepLabel + ($index+1) }}  </span>' +
        '<span flex style="height: 1px; background:rgba(0,0,0,.15); margin-left: 8px"></span> ' +
        '</kds-step-item>';
    },
  }
}


/**
 * @ngdoc directive
 * @name kdsStepsWrapper
 * @description
 * The wrapper for the steps pagination
 * @restrict E
 */
angular.module('kds.stepper')
  .directive('kdsStepItem', KdsStepItem);

function KdsStepItem() {
  return {
    restrict: 'E',
    require:  '^kdsStepper',
  }
}


/**
 * @ngdoc directive
 * @name kdsStep
 * @description
 * Wrapper for the actual content of each step
 *
 * @restrict E
 */
angular.module('kds.stepper')
  .directive('kdsStepsContent', kdsStepsContent);

function kdsStepsContent() {
  return {
    restrict: 'E',
    require:  '^kdsStepper'
  };
}


/**
 * @ngdoc directive
 * @name kdsStep
 * @description
 * The directive `<kds-stepper>` serves as the container for `<kds-step>` child directives to produces a Stepper component.
 * @restrict E
 */
angular
  .module('kds.stepper')
  .directive('kdsStep', KdsStep);

function KdsStep($compile) {
  return {
    terminal: true,
    restrict: 'E',
    require:  '^kdsStepper',
    link:     function (scope, elem, attrs, controller) {

      var stepElem      = scope.$parent.step.elem,
          attributes    = [],
          attributesMap = stepElem.attributes;

      for (var j = 0; j < attributesMap.length; j++) {
        attrs.$set(normalizeName(attributesMap[j].name), attributesMap[j].value);
      }

      var kdsSteps    = elem.parent().children(),
          i           = Array.prototype.indexOf.call(kdsSteps, elem[0]),
          mdContent   = angular.element('<md-content></md-content>'),
          parentScope = scope.$parent.$parent.$parent, // TODO: Check if there's a better solution
          stepContent = $compile(stepElem.innerHTML)(parentScope);


      mdContent.append(stepContent);
      elem.append(mdContent);

      var a = this;
      scope.$watch(function () {
        return parentScope.$eval(attrs.stepDone);
      }, function (newVal, oldVal, a, b) {
        console.log(newVal);
        console.log(oldVal);
        console.log(a);
        console.log(b);
        console.log('_________________________');
        if(newVal && !oldVal) controller.currentStep++;
      });


      //console.log(parentScope.$eval(attrs.stepDone));
    },
  }
}
KdsStep.$inject = ['$compile'];


function normalizeName(name) {
  var ind       = name.indexOf('-');
  name          = name.replace('-', '');
  var uppercase = name[ind].toUpperCase();
  name          = name.split('');
  name[ind]     = uppercase;
  name          = name.join('');
  return name;
}