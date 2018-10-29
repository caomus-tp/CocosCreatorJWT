// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var jwt = require("jsonwebtoken");

// var _crypt       = require('cryptlib');   
// var jwt          = require('jsonwebtoken');
// var fs           = require('fs');
// var jws          = require('jws');
var decodedToken:string;
var decoded2:string;
var viwer = null;

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.EditBox) inputStrToken: cc.EditBox = null;
    @property(cc.EditBox) inputStrKey: cc.EditBox = null;
    @property(cc.Button) btnCheck: cc.Button = null;
    @property(cc.Button) btnClose: cc.Button = null;
    @property(cc.Layout) layoutLogViewer: cc.Layout = null;
    @property(cc.EditBox) inputLogView: cc.EditBox = null;

    strToken:string = '';
    strKey:string = '';    



    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        viwer = this.layoutLogViewer;
        // Cryptlib.generateRandomIV("ss");
        this.btnCheck.node.on('click',this.onCheckJWT, this);
        this.btnClose.node.on('click', this.onCloseLogViwer, this);        
    }

    onDestroy() {
        this.btnCheck.node.off('click',this.onCheckJWT,this);
    }

    start () {
        console.log('onLoad ============================\n');                
        /* Patern parameter
          - appname
          - callback
          - ssoid
          - lang   << th/en
          - trueid   << login account
          - access_token  << from login trueid
        */
        
        var jsonData = {
            appname: cc.sys.localStorage.getItem("appname"),
            callback: cc.sys.localStorage.getItem("callback"),
            ssoid: cc.sys.localStorage.getItem("ssoid"),
            lang: cc.sys.localStorage.getItem("lang"),
            trueid: cc.sys.localStorage.getItem("trueid"),
            access_token: cc.sys.localStorage.getItem("access_token")
        }                

        this.print_data_callback_post(jsonData);     
        // remove the item of the key (username)
        cc.sys.localStorage.removeItem('appname');
        cc.sys.localStorage.removeItem('callback');
        cc.sys.localStorage.removeItem('ssoid');
        cc.sys.localStorage.removeItem('lang');
        cc.sys.localStorage.removeItem('trueid');
        cc.sys.localStorage.removeItem('access_token');        
        cc.sys.localStorage.clear();      
    }

    onCheckJWT() {        
        this.strToken = decodedToken;
        this.strKey = this.inputStrKey.string;
        cc.log("strToken : ", this.strToken);
        cc.log("strKey : ", this.strKey);
        
        jwt.verify(this.strToken, this.strKey, function callback (err, decoded) {
            if (err) {
                console.log(err);
                // decoded1 = JSON.stringify(err);
            } else  {            
                console.log(decoded); // bar
                // decoded1 = JSON.stringify(decoded);
            }
        });

        // alg mismatch
       
        jwt.verify(this.strToken, this.strKey, { algorithms: ['RS256'] }, function (err, payload) {
            // if token alg != RS256,  err == invalid signature
            if (err) {
                console.log(err);
                decoded2 = JSON.stringify(err);
            } else  {            
                console.log(payload); // bar
                decoded2 = JSON.stringify(payload);                
            }
        });
        viwer.node.runAction(this.setEnableAction());        

    }

    onCloseLogViwer() {
        viwer.node.runAction(this.setDisableAction());
        cc.log("close");
    }

    stopShowAction() {        
        this.inputLogView.string = this.setFormatStringJSON(decoded2);
    }

    stopCloseAction() {
        this.inputLogView.string = "";
    }

    setEnableAction() {
        let posX = viwer.node.getContentSize().width / 2;
        var actionMove = cc.moveTo(0.3, cc.v2(posX, 0));
        var actionCallFunc = cc.callFunc(this.stopShowAction, this);
        return cc.sequence(actionMove, actionCallFunc);
    }

    setDisableAction() {        
        let posX = viwer.node.getContentSize().width / 2;
        var actionMove = cc.moveTo(0.3, cc.v2(posX, -960));
        var actionCallFunc = cc.callFunc(this.stopCloseAction, this);
        return cc.sequence(actionMove, actionCallFunc);
    }

    setFormatStringJSON(_json:any) {
        var strFmt = _json;

        return strFmt;
    }

    // update (dt) {}

    getUrlParameter(name): string {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    print_data_callback_get() {
        var urlParams = new URLSearchParams(window.location.search);
        var keys = urlParams.keys();
        // this.msgLog += 'param from URL \n';    
        for (let key in keys) { 
            console.log(key); 
            console.log('key: ' +key + ', value: ' + this.getUrlParameter(key) +'\n');
        }        
    }

    print_data_callback_post(_obj:any) {
        cc.log('object :>> '+JSON.stringify(_obj));
        // this.inputStrToken.string = JSON.stringify(_obj);
        decodedToken = _obj.access_token;
        this.inputStrToken.string = "App name : \t" + _obj.appname;
        this.inputStrToken.string += "\nCallback : \t" + _obj.callback;
        this.inputStrToken.string += "\nSSO ID : \t" + _obj.ssoid;
        this.inputStrToken.string += "\nLang : \t" + _obj.lang;
        this.inputStrToken.string += "\nTrue ID : \t" + _obj.trueid;
        this.inputStrToken.string += "\nAccess Token : \n\t" + _obj.access_token;
        // this.msgLog += 'usernmane :>> '+_username + '\n' + 'token :>> ' + _token;
        // this.lblLog.string = this.msgLog;
    }
}
