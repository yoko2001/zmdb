import { pinyin } from 'pinyin-pro';

let mark = (content, keyword) => {
    content = content.replace(/\s+/g,"^");

    content = content.replaceAll(keyword, `[${keyword}]`);

    const pinyinContentArray = pinyin(content, {toneType:'num', type:'array'});
    console.log(`content.length:${content.length},pinyinContent.length:${pinyinContentArray.length}`);

    const pinyinKeywordArray = pinyin(keyword, {toneType:'num', type:'array'});

    let excludes = new Set();
    let p = 0;
    while (p < pinyinContentArray.length) {
        let flag = true;
        for (let i = 0; i < pinyinKeywordArray.length; ++i) {
            if (pinyinKeywordArray[i] !== pinyinContentArray[p + i]) {
                flag = false;
                break;
            }
        }
        if (flag) {
            const matchedKeyword = content.substring(p, p + keyword.length);
            if (matchedKeyword !== keyword) {
                excludes.add(matchedKeyword);
            }
            p += pinyinKeywordArray.length;
        } else {
            p += 1;
        }
    }
    let r = content;
    excludes.forEach(matchedKeyword => {
        r = r.replaceAll(matchedKeyword, `{${matchedKeyword}}`);
    });
    r = r.replaceAll('^', ' ');
    return r;
};

// let content = 'tell me tell me tell me';
let content = '那个3,000是沐霂木木木目目';
const keyword = '沐霂';
console.log(mark(content, keyword));