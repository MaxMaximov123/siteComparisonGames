/**
 * @param {Array} game1 - History of first game
 * @param {Array} game2 - History of second game: game[i] = Object
 * game[i] = {
 *            "id": Integer,
 *            "globalGameId": Integer,
 *            "team1Name": String,
 *            "team2Name": String, 
 *            "score1": Integer,
 *            "score2": Integer,
 *            "first": Float,
 *            "draw": Float,
 *            "second": Float,
 *            "firstOrDraw": Float,
 *            "DrawOrSecond": Float,
 *            "now": Integer:,
 *            "bookie": String
 *          }

 */


function copy(obj){
    return JSON.parse(JSON.stringify(obj));
}

function data_on_tik(history, tik, LiST_OUTCOMES, KEYS){
    for (var row_ind=0;row_ind<history.length-1;row_ind++){
        var row = history[row_ind];
        row.now = Math.floor(row.now/1000);
        if (row.now > tik){
            let ret_d = copy(row);
            for (let k of KEYS){
                ret_d[k] = null;
            }
            ret_d.now = tik;
            return ret_d;
        }
        if (row.now <= tik && tik <= Math.floor(history[row_ind + 1].now / 1000)){
            let ret_d = copy(row);
            ret_d.now = tik;
            
            for (let outcome of LiST_OUTCOMES){
                if (ret_d[outcome] !== 0) {
                    ret_d[outcome] = 1 / ret_d[outcome];
                }
                else ret_d[outcome] = null;
            }
            return ret_d;
        }
    }
    let ret_d = copy(history.at(-1));
    ret_d.now = tik;
    return ret_d;
}


function compare_games(game1, game2){
    const TIK_STEP = 3;  // временной шаг(в секундах)
    const LiST_OUTCOMES = ['first', 'draw', 'second', 'firstOrDraw', 'drawOrSecond']; // список ключей исходов 
    const ALL_KEYS = ['id', 'globalGameId', 'team1Name', 'team2Name', 'score1', 'score2', 'first', 'draw', 'second', 'firstOrDraw', 'drawOrSecond']
    const KEYS = ['score1', 'score2', 'first', 'draw', 'second', 'firstOrDraw', 'drawOrSecond'];

    // границы сдвига
    const START_SHIFT = -3
    const FIN_SHIFT = 3

    // ___________Выравнивание_данных_по_времени___________

    var min_time = Math.floor(Math.max(game1[0].now, game2[0].now) / 1000);
    var max_time = Math.floor(Math.max(game1.at(-1).now, game2.at(-1).now) / 1000);

    var new_game1 = [];
    var new_game2 = [];

    
    for (let time_step=min_time;time_step<max_time;time_step+=TIK_STEP){
        new_game1.push(data_on_tik(copy(game1), time_step, LiST_OUTCOMES, KEYS));
        new_game2.push(data_on_tik(copy(game2), time_step, LiST_OUTCOMES, KEYS));
    }

    // ___________Сравнение_данных______________
    // console.log(new_game2);
    var total_similarity_scores = 0;
    var total_similarity_outcomes = {};
    LiST_OUTCOMES.forEach((outcome) => {total_similarity_outcomes[outcome] = 0})
    for (let key of KEYS){
        for (let shift=START_SHIFT;shift<FIN_SHIFT+1;shift++){
            var COUNT_TIKS = Math.max(new_game1.length, new_game2.length);
            var similarity_scores_on_shift = 0;
            var similarity_outcomes_on_shift = {};
            LiST_OUTCOMES.forEach((outcome) => {similarity_outcomes_on_shift[outcome] = 0})
            for (num_tik=-START_SHIFT;num_tik<COUNT_TIKS-FIN_SHIFT;num_tik++){
                if (new_game1[num_tik + shift]?.[key] != null && new_game2[num_tik]?.[key] != null){
                    d1 = new_game1[num_tik + shift][key];
                    d2 = new_game2[num_tik][key];
                    if (['score1', 'score2'].includes(key)){
                        similarity_scores_on_shift += d1 === d2;
                    } else {
                        if (d1 !== 0 && d2 !== 0) similarity_outcomes_on_shift[key] += Math.min(d1, d2) / Math.max(d1, d2);
                        else COUNT_TIKS--;
                    }
                } else COUNT_TIKS--;

            }

            // console.log(similarity_outcomes_on_shift);
            if (COUNT_TIKS > FIN_SHIFT - START_SHIFT){
                similarity_scores_on_shift = similarity_scores_on_shift / (COUNT_TIKS - (FIN_SHIFT - START_SHIFT));
                similarity_outcomes_on_shift[key] = similarity_outcomes_on_shift[key] / (COUNT_TIKS - (FIN_SHIFT - START_SHIFT));
            } else {
                similarity_outcomes_on_shift = 0;
                similarity_scores_on_shift = 0;
            }
            if (similarity_outcomes_on_shift[key] > total_similarity_outcomes[key]) total_similarity_outcomes[key] = similarity_outcomes_on_shift[key];
            if (similarity_scores_on_shift > total_similarity_scores) total_similarity_scores = similarity_scores_on_shift;
        }
    }
    console.log(total_similarity_scores, total_similarity_outcomes);
    total_similarity_outcomes['scores'] = total_similarity_scores;
    return [new_game1, new_game2, JSON.stringify(total_similarity_outcomes)];


}

function getRandomNumber(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}


const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./data/1.06/history_1.0.db');

function main(id1, id2) {
  return new Promise((resolve, reject) => {
    let sql1 = `SELECT * FROM data WHERE id = ${id1}`;

    db.all(sql1, function(err, rows1) {
      if (err) {
        reject(err);
        return;
      }
      let sql2 = `SELECT * FROM data WHERE id = ${id2}`;
      db.all(sql2, function(err, rows2) {
        if (err) {
          reject(err);
          return;
        }

        const game1 = rows1;
        const game2 = rows2;
        const res = compare_games(game1, game2);
        resolve(res);
      });
    });
  });
}


if (require.main === module) {
    main()
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.error(error);
      });
    }
module.exports = main;