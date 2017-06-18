const Rabbit = require('Rabbit');
const EventType = require('Types').EventType;
const Tween = require('TweenLite');

cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Label,
        desc: cc.Label,
        sunshine: cc.Animation,
        rain: cc.ParticleSystem,
        rabbit: Rabbit,
        strtitle: [cc.String],
        strDesc: [cc.String],
        yearsDivide: 0,
        eventCount: 0,
        eventDuration: 0, //year
        fadeDuration: 0
    },

    init (game) {
        this.game = game;
        this.eventYears = [];
        this.stopEvent();
        this.generateEventYears();
        this.title.enabled = false;
        this.desc.enabled = false;
        this.rain.stopSystem();        
        this.sunshine.active = false;
        // this.eventOn = false;
    },

    generateEventYears () {
        let count = 0;
        while (count < this.eventCount) {
            let min = count * this.yearsDivide;
            let year = min + Math.floor(Math.random() * this.yearsDivide / 2);
            this.eventYears.push(year);
            count++;
        }
    },

    tick () {
        let year = this.game.year;
        if (year === this.eventEndYear) {
            this.stopEvent();
        }
        this.checkEventForYear(year);
    },

    checkEventForYear(year) {
        let index = this.eventYears.indexOf(year);   
        if (index !== -1) {
            this.eventYears.splice(index, 1);
            // this.eventOn = true;
            this.eventEndYear = year + this.eventDuration;
            let eventType = Math.floor(Math.random() * 3);
            if (eventType === EventType.Sunshine) {
                this.startSunshine(); 
            } else if (eventType === EventType.Rain) {
                this.startRain();
            } else if (eventType === EventType.Rabbit) {
                this.startRabbit();
            }
            this.title.enabled = true;
            this.desc.enabled = true;
            this.title.node.opacity = 0;
            this.desc.node.opacity = 0;
            Tween.to(this.title.node, this.fadeDuration, {
                opacity: 255
            });
            Tween.to(this.desc.node, this.fadeDuration, {
                opacity: 255
            });
        }
    },

    stopEvent() {
        this.sunshine.stop();
        this.sunshine.node.active = false;
        this.rain.stopSystem();
        // this.rain.node.active = false;
        this.game.resMng.updateEventRes(0, 0);        
        Tween.to(this.title.node, this.fadeDuration, {
            opacity: 0
        });
        Tween.to(this.desc.node, this.fadeDuration, {
            opacity: 0
        });
    },

    startSunshine () {
        this.sunshine.active = true;
        this.sunshine.play('sunshine');
        this.game.resMng.updateEventRes(-2, 5);
    },

    startRain() {
        this.rain.resetSystem();
        // this.rain.enabled = true;
        this.game.resMng.updateEventRes(4, -2);
    },

    startRabbit() {
        cc.log('rabbit spawn');
        let isLeft = Math.random() > 0.5 ? true: false;
        // this.rabbit.startRun(isLeft);
    }

});