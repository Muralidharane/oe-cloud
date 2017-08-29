var XLSX = require('xlsx');
var DL = require('js-feel').decisionLogic;
var logger = require('oe-logger');
var log = logger('decision-service');
var util = require('util');

module.exports = function(DecisionService) {
  DecisionService.observe('before save', function(ctx, next) {
    var dataObj = ctx.instance || ctx.data;
    var decisions = dataObj.decisions;
    
    dataObj["decision-graph"](ctx.options, function(err, result){
      if (err) {
        next(err);
      }
      else {
        // var keys = result.data;
        if (decisions.every(p => p in result.data)) {
          next();
        }
        else {
          var idx = decisions.findIndex(d => !(d in result.data));
          var item = decisions[idx];
          var errStr = util.format('Decision %s does not belong to the decision graph: %s', item, result.graphName);
          log.error(errStr);
          next(new Error(errStr));
        }       
      }
    });
  });

  DecisionService.remoteMethod('invoke', {
    description: 'Invoke service with name and payload',
    accepts: [
      {
        arg: 'name',
        type: 'string',
        description: 'service name',
        http: {
          source: 'path'
        },
        required: true,
        description: 'name of the service'
      },
      {
        arg: 'payload',
        type: 'object',
        description: 'the payload for this decision service',
        http: {
          source: 'body'
        },
        required: true
      }
    ],
    returns: {
      arg: 'response',
      type: 'object',
      root: true
    },
    http: {
      verb: 'POST',
      path: '/invoke/:name'
    }
  });

  DecisionService.invoke = function DecisionServiceInvoke(name, payload, options, cb) {
    setTimeout(function(){
      cb(null, { response: { name, payload }});
    })
  }
}