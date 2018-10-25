// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import cryptlib from "cryptlib";
import jwt from "jsonwebtoken";
// var _crypt       = require('cryptlib');   
// var jwt          = require('jsonwebtoken');
// var fs           = require('fs');
// var jws          = require('jws');

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.EditBox) inputStrToken: cc.EditBox = null;
    @property(cc.EditBox) inputStrKey: cc.EditBox = null;
    @property(cc.Button) btnCheck: cc.Button = null;
    @property(cc.Layout) layoutLogViewer: cc.Layout = null;

    strToken:string = '';
    strKey:string = '';


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // Cryptlib.generateRandomIV("ss");
        this.btnCheck.node.on('click',this.onCheckJWT,this);
    }

    onDestroy() {
        this.btnCheck.node.off('click',this.onCheckJWT,this);
    }

    start () {

    }

    openLogViwer() {
        // this.layoutLogViewer.
    }

    onCheckJWT() {
        this.strToken = this.inputStrToken.string;
        this.strKey = this.inputStrKey.string;
        cc.log("strToken : ", this.strToken);
        cc.log("strKey : ", this.strKey);
        jwt.verify(this.strToken, this.strKey, function (decoded) {
            // if (err) {
            //     console.log(err);
            // } else  {            
                console.log(decoded) // bar
            // }
        });

        // alg mismatch
        jwt.verify(this.strToken, this.strKey, { algorithms: ['RS256'] }, function (err, payload) {
            // if token alg != RS256,  err == invalid signature
            if (err) {
                console.log(err);
            } else  {            
                console.log(payload) // bar
            }
        });
        // this.layoutLogViewer.node.runAction(this.setEnableAction());
    }

    onCloseLogViwer() {
        // this.layoutLogViewer.node.runAction(this.setDisableAction());
    }

    stopAction() {

    }

    setEnableAction() {
        let posX = this.layoutLogViewer.node.getContentSize().width / 2;
        var actionMove = cc.moveTo(0.3, cc.v2(posX, 0));
        var actionCallFunc = cc.callFunc(this.stopAction, this);
        return cc.sequence(actionMove, actionCallFunc);
    }

    setDisableAction() {        
        let posX = this.layoutLogViewer.node.getContentSize().width / 2;
        var actionMove = cc.moveTo(0.3, cc.v2(posX, -960));
        var actionCallFunc = cc.callFunc(this.stopAction, this);
        return cc.sequence(actionMove, actionCallFunc);
    }
    // update (dt) {}
}
