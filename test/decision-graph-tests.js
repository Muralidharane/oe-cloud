/**
 * 
 * ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 * 
 */
var chalk = require('chalk');
var bootstrap = require('./bootstrap');
var expect = bootstrap.chai.expect;
//var loopback = require('loopback');
var models = bootstrap.models;
var app = bootstrap.app;
var chai = require('chai');
chai.use(require('chai-things'));
var _db = require('mongodb').Db;
var _srvr = require('mongodb').Server;
//var api = bootstrap.api;
//var debug = require('debug')('decision-table-test');
var mongoHost = process.env.MONGO_HOST || 'localhost';
var dbName = process.env.DB_NAME || 'db';

describe(chalk.blue('Decision graph insertion tests'), function() {
    before('remove db entries', function(done){
        models.DecisionGraph.destroyAll({}, bootstrap.defaultContext, function(err){
            done();
        });
    });
    after('remove db entries', function(done){
        models.DecisionGraph.destroyAll({}, bootstrap.defaultContext, function(){
            done();
        });
    });
    it('should parse and insert workbook data correctly', function(done) {
        //our workbook is a base64 encoded string.
        var workbookBase64 = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,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";
        var inputData = {
            graphName: 'foo',
            file: workbookBase64
        };
        
        models.DecisionGraph.create(inputData, bootstrap.defaultContext, function(err, decisionGraph) {
            // debugger;
            expect(decisionGraph).to.be.defined;
            // expect(decisionGraph).to.be.array;
            expect(decisionGraph.data).to.be.object;
            expect(decisionGraph.data).to.have.property('_services')
            done(err);
        });
    });
});

