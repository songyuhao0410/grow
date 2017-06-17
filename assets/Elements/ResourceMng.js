const ResType = require('Types').ResType;
const ResourceMeter = require('ResourceMeter');
cc.Class({
    extends: cc.Component,

    properties: {
        gainPerTick: 0,
        maxStorage: 0,
        waterMeter: ResourceMeter,
        lightMeter: ResourceMeter,
        labelNutrition: cc.Label
    },

    init () {
        this.waterList = [];
        this.leafCount = 0;
        this.waterStorage = 0;
        this.lightStorage = 0;
        this.nutrition = 0;
        this.waterMeter.init(this);
        this.lightMeter.init(this);
        this.updateNutrition(0);
    },

    registerResource (res) {
        this.waterList.push(res);
    },

    resetMeter (resType) {
        if (resType === ResType.Water) {
            this.waterMeter.updateProgress(0);
        } else {
            this.lightMeter.updateProgress(0);
        }
    },

    updateNutrition (delta) { //can be positive or negative
        this.nutrition += delta;
        this.labelNutrition.string = this.nutrition;
    },

    tick () {
        for (let i = 0; i < this.waterList.length; ++i) {
            let res = this.waterList[i];
            if (res.isActive) {
                res.updateVol(this.gainPerTick);
                this.waterStorage += this.gainPerTick;
                this.waterMeter.updateProgress(this.waterStorage/ this.maxStorage);
                if (this.waterStorage >= this.maxStorage) {
                    this.waterMeter.onResFull1();
                    this.waterStorage = 0;
                }
            }
        }
    }
});
