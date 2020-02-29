void((function(undefined){
    try{
        if(location.hostname !== 'character-sheets.appspot.com'){
            window.alert('このサイトでは使用できません');
            return;
        }
        let url;
        let bloburl;
        let a;

        let oSerializer;
        let sXML;

        let playerName;
        let characterName;
        let level;
        let core;
        let attribute;
        let scene;
        let gender;
        let age;
        let physical;
        let vitality;
        let maxHP;
        let HP;

        let warfare;
        let technique;
        let brain;
        let spirit;
        let love;
        let mundane;

        let numberElement;
        let number = [];
        
        let rehearsal = [];
        let encore = [];
        let backup = [];
        let moneyAndOther;

        let partnerName;
        let frontPersonality;
        let backPersonality;
        let hobby;
        let appearance;
        let firstPersonPronoun;
        let nickname;
        let encounter;

        let loverElement;
        let lover = [];
        let cooperatorElement;
        let cooperator = [];

        let chatPaletteText;

        function makeNormalElement(eName,eAttribute,eText){
            let elem = document.createElement('data');
            elem.setAttribute(eName,eAttribute);
            elem.innerText = eText;
            return elem;
        }

        function makeResourceElement(rName,rAttribute,rText,rCurrent){
            let elem = document.createElement('data');
            elem.setAttribute('type','numberResource');
            elem.setAttribute('currentValue',rCurrent);
            elem.setAttribute(rName,rAttribute);
            elem.innerText = rText;
            return elem;
        }

        function makeNoteElement(nName,nAttribute,nText){
            let elem = document.createElement('data');
            elem.setAttribute('type','note');
            elem.setAttribute(nName,nAttribute);
            elem.innerText = nText;
            return elem;
        }

        function setStatus(id1,id2){
            let val1 = document.getElementById(id1).value;
            let val2 = document.getElementById(id2).value;
            let returnString;
            switch(val1){
                case '1':
                    returnString = 'C';
                    break;
                case '2':
                    returnString = 'B';
                    break;
                case '3':
                    returnString = 'A';
                    break;
                case '4':
                    returnString = 'S';
                    break;
                default:
                    throw 'Error in setStatus()';
            }
            switch(val2){
                case '+-0':
                    break;
                case '+1':
                    returnString += '+';
                    break;
                case '+2':
                    returnString += '++';
                    break;
                default:
                    throw 'Error in setStatus()';
            }
            return returnString;
        }

        // 変数に取り込み
        playerName = document.getElementById('base.player').value;
        characterName = document.getElementById('base.name').value;
        level = document.getElementById('base.level').value;
        core = document.getElementById('base.core').value;
        attribute = document.getElementById('base.attribute').getElementsByClassName('selected')[0].innerText;
        scene = document.getElementById('base.scene').value;
        gender = document.getElementById('base.sex').value;
        age = document.getElementById('base.age').value;
        physical = document.getElementById('condition.physical').value;
        vitality = document.getElementById('condition.vitality').value;
        maxHP = document.getElementById('condition.hitpoint.max').value;
        HP = document.getElementById('condition.hitpoint.current').value;

        warfare = setStatus('ability.brave.eval', 'ability.brave.plus');
        technique = setStatus('ability.technic.eval', 'ability.technic.plus');
        brain = setStatus('ability.brain.eval', 'ability.brain.plus');
        spirit = setStatus('ability.spirit.eval', 'ability.spirit.plus');
        love = setStatus('ability.love.eval', 'ability.love.plus');
        mundane = setStatus('ability.mundane.eval', 'ability.mundane.plus');

        numberElement = document.getElementById('number').getElementsByTagName('tbody')[0].children;
        for(let i = 0; i < numberElement.length; i++){
            number.push([numberElement[i].children[1].firstElementChild.value,numberElement[i].children[2].firstElementChild.value,numberElement[i].children[3].firstElementChild.value,numberElement[i].children[4].firstElementChild.value,numberElement[i].children[5].firstElementChild.value.replace(/\n/g,'')]);
        }

        rehearsal.push(document.getElementById('appli.0').children[1].firstElementChild.value);
        rehearsal.push(document.getElementById('appli.0').children[2].firstElementChild.value);
        encore.push(document.getElementById('appli.001').children[1].firstElementChild.value);
        encore.push(document.getElementById('appli.001').children[2].firstElementChild.value);
        backup.push(document.getElementById('appli.002').children[1].firstElementChild.value);
        backup.push(document.getElementById('appli.002').children[2].firstElementChild.value);
        moneyAndOther = document.getElementById('applifoot.money').value;

        partnerName = document.getElementById('base.otodama.name').value;
        frontPersonality = document.getElementById('base.otodama.front').value;
        backPersonality = document.getElementById('base.otodama.back').value;
        hobby = document.getElementById('base.otodama.hobby').value;
        appearance = document.getElementById('base.otodama.appearance').value;
        firstPersonPronoun = document.getElementById('base.otodama.person').value;
        nickname = document.getElementById('base.otodama.nickname').value;
        encounter = document.getElementById('base.otodama.encounter').value;

        loverElement = document.getElementById('personalities').getElementsByTagName('tbody')[0].children;
        for(let i = 0; i < loverElement.length; i++){
            lover.push([loverElement[i].children[1].firstElementChild.value,loverElement[i].children[2].firstElementChild.value,loverElement[i].children[3].firstElementChild.value,loverElement[i].children[4].firstElementChild.value]);
        }
        cooperatorElement = document.getElementById('personalities').getElementsByTagName('tbody')[1].children;
        for(let i = 1; i < cooperatorElement.length; i++){
            cooperator.push([cooperatorElement[i].children[1].firstElementChild.value,cooperatorElement[i].children[2].firstElementChild.value,cooperatorElement[i].children[3].firstElementChild.value,cooperatorElement[i].children[4].firstElementChild.value]);
        }
        chatPaletteText = 'R{武勇} 武勇判定\nR{技術} 技術判定\nR{頭脳} 頭脳判定\nR{霊力} 霊力判定\nR{愛} 愛判定\nR{日常} 日常判定\n\n';
        for(let i = 0; i < number.length; i++){
            chatPaletteText += number[i].join('/');
            chatPaletteText += '\n';
        }

        // xml作成
        let charElem = document.createElement('character');
        charElem.setAttribute('location.name','table');
        charElem.setAttribute('location.x','0');
        charElem.setAttribute('location.y','0');
        charElem.setAttribute('posZ','0');
        charElem.setAttribute('rotate','0');
        charElem.setAttribute('roll','0');

        let dataChar = makeNormalElement('name','character','');

        let dataImg = makeNormalElement('name','image','');
        let imgChild = document.createElement('data');
        imgChild.setAttribute('type','image');
        imgChild.setAttribute('name','imageIdentifier');
        dataImg.appendChild(imgChild);
        dataChar.appendChild(dataImg);

        let dataCommon = makeNormalElement('name','common','');
        let dataName = makeNormalElement('name','name',characterName);
        dataCommon.appendChild(dataName);
        let dataSize = makeNormalElement('name','size','1');
        dataCommon.appendChild(dataSize);
        dataChar.appendChild(dataCommon);

        let dataDetail = makeNormalElement('name','detail','');

        let baseElem = makeNormalElement('name','基本設定','');
        let playerNameElem = makeNormalElement('name','プレイヤー名',playerName);
        baseElem.appendChild(playerNameElem);
        let levelElem = makeNormalElement('name','レベル',level);
        baseElem.appendChild(levelElem);
        let coreElem = makeNormalElement('name','コア',core);
        baseElem.appendChild(coreElem);
        let attributeElem = makeNormalElement('name','属性',attribute);
        baseElem.appendChild(attributeElem);
        let sceneElem = makeNormalElement('name','情景',scene);
        baseElem.appendChild(sceneElem);
        let genderElem = makeNormalElement('name','性別',gender);
        baseElem.appendChild(genderElem);
        let ageElem = makeNormalElement('name','年齢',age);
        baseElem.appendChild(ageElem);
        dataDetail.appendChild(baseElem);

        let resourceElem = makeNormalElement('name','リソース','');
        let HPElem = makeResourceElement('name','生命力',maxHP,HP);
        resourceElem.appendChild(HPElem);
        let physicalElem = makeNormalElement('name','体力',physical);
        resourceElem.appendChild(physicalElem);
        let vitalityElem = makeNormalElement('name','活力',vitality);
        resourceElem.appendChild(vitalityElem);
        dataDetail.appendChild(resourceElem);

        let statusElem = makeNormalElement('name','能力値','');
        let warfareElem = makeNormalElement('name','武勇',warfare);
        statusElem.appendChild(warfareElem);
        let techniqueElem = makeNormalElement('name','技術',technique);
        statusElem.appendChild(techniqueElem);
        let  brainElem = makeNormalElement('name','頭脳',brain);
        statusElem.appendChild(brainElem);
        let spiritElem = makeNormalElement('name','霊力',spirit);
        statusElem.appendChild(spiritElem);
        let loveElem = makeNormalElement('name','愛',love);
        statusElem.appendChild(loveElem);
        let mundaneElem = makeNormalElement('name','日常',mundane);
        statusElem.appendChild(mundaneElem);
        dataDetail.appendChild(statusElem);

        let numberElem = makeNormalElement('name','ナンバー','');
        for(let i = 0; i < number.length; i++){
            let skillElem = makeNormalElement('name',number[i][0],number[i][1]+'/'+number[i][2]+'/'+number[i][3]+'/'+number[i][4]);
            numberElem.appendChild(skillElem);
        }
        dataDetail.appendChild(numberElem);

        let appliElem = makeNormalElement('name','アプリ','');
        let rehearsalElem = makeResourceElement('name','リハーサル',rehearsal[0],toString(parseInt(rehearsal[0])-parseInt(rehearsal[1])));
        appliElem.appendChild(rehearsalElem);
        let encoreElem = makeResourceElement('name','アンコール',encore[0],toString(parseInt(encore[0])-parseInt(encore[1])));
        appliElem.appendChild(encoreElem);
        let backupElem = makeResourceElement('name','バックアップ',backup[0],toString(parseInt(backup[0])-parseInt(backup[1])));
        appliElem.appendChild(backupElem);
        let moneyElem = makeNormalElement('name','所持金・その他',moneyAndOther);
        appliElem.appendChild(moneyElem);
        dataDetail.appendChild(appliElem);

        let partnerElem = makeNormalElement('name','オトダマ','');
        let partnerNameElem = makeNormalElement('name','オトダマ名',partnerName);
        partnerElem.appendChild(partnerNameElem);
        let frontPersonalityElem = makeNormalElement('name','表の性格',frontPersonality);
        partnerElem.appendChild(frontPersonalityElem);
        let backPersonalityElem = makeNormalElement('name','裏の性格',backPersonality);
        partnerElem.appendChild(backPersonalityElem);
        let hobbyElem = makeNormalElement('name','趣味',hobby);
        partnerElem.appendChild(hobbyElem);
        let appearanceElem = makeNormalElement('name','外見',appearance);
        partnerElem.appendChild(appearanceElem);
        let firstPersonPronounElem = makeNormalElement('name','一人称',firstPersonPronoun);
        partnerElem.appendChild(firstPersonPronounElem);
        let nicknameElem = makeNormalElement('name','呼び名',nickname);
        partnerElem.appendChild(nicknameElem);
        let encounterElem = makeNormalElement('name','出会い',encounter);
        partnerElem.appendChild(encounterElem);
        dataDetail.appendChild(partnerElem);

        let personalitiesElem = makeNormalElement('name','人物欄','');
        let loverParent = makeNormalElement('name','想い人','');
        for(let i = 0; i < lover.length; i++){
            let loverElem = makeNormalElement('name',lover[i][0],lover[i][1]+'/'+lover[i][2]+'/'+lover[i][3]);
            loverParent.appendChild(loverElem);
        }
        personalitiesElem.appendChild(loverParent);
        let cooperatorParent = makeNormalElement('name','協力者','');
        for(let i = 0; i < cooperator.length; i++){
            let cooperatorElem = makeNormalElement('name',cooperator[i][0],cooperator[i][1]+'/'+cooperator[i][2]+'/'+cooperator[i][3]);
            cooperatorParent.appendChild(cooperatorElem);
        }
        personalitiesElem.appendChild(cooperatorParent);
        dataDetail.appendChild(personalitiesElem);

        let otherElem = makeNormalElement('name','その他','');
        let memoElem = makeNoteElement('name','メモ','');
        otherElem.appendChild(memoElem);
        dataDetail.appendChild(otherElem);

        dataChar.appendChild(dataDetail);
        charElem.appendChild(dataChar);

        let chatPaletteElem = document.createElement('chat-palette');
        chatPaletteElem.setAttribute('dicebot','HatsuneMiku');
        chatPaletteElem.textContent = chatPaletteText;
        charElem.appendChild(chatPaletteElem);

        // xmlを作る
        oSerializer = new XMLSerializer();
        sXML = oSerializer.serializeToString(charElem);
        sXML = sXML.replace(/xmlns="http:\/\/www.w3.org\/1999\/xhtml"/g,'');
        sXML = sXML.replace(/currentvalue/g,'currentValue');

        // xmlをダウンロードさせる
        blob  = new Blob([sXML]);
        url = window.URL;
        bloburl = url.createObjectURL(blob);

        a = document.createElement('a');
        a.download = 'data.xml';
        a.href = bloburl;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    catch(e){
        window.alert('失敗しました\n'+e);
    }
})());