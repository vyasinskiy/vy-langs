module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[project]/web/app/api/answers/check/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/lib/db.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const dynamic = "force-dynamic";
function levenshteinDistance(str1, str2) {
    const matrix = Array(str2.length + 1).fill(null).map(()=>Array(str1.length + 1).fill(null));
    for(let i = 0; i <= str1.length; i++){
        matrix[0][i] = i;
    }
    for(let j = 0; j <= str2.length; j++){
        matrix[j][0] = j;
    }
    for(let j = 1; j <= str2.length; j++){
        for(let i = 1; i <= str1.length; i++){
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[j][i] = Math.min(matrix[j][i - 1] + 1, matrix[j - 1][i] + 1, matrix[j - 1][i - 1] + indicator);
        }
    }
    return matrix[str2.length][str1.length];
}
async function POST(req) {
    const client = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].connect();
    try {
        await client.query("BEGIN");
        const body = await req.json();
        const { wordId, answer } = body;
        if (!wordId || !answer) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Word ID and answer are required"
            }, {
                status: 400
            });
        }
        const wordResult = await client.query(`SELECT id, language_id, english, russian FROM vy_words WHERE id = $1`, [
            wordId
        ]);
        const word = wordResult.rows[0];
        if (!word) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Word not found"
            }, {
                status: 404
            });
        }
        const userAnswer = answer.toLowerCase().trim();
        const correctAnswer = word.english.toLowerCase().trim();
        const isCorrect = userAnswer === correctAnswer;
        let isSynonym = false;
        let synonymWord = null;
        if (!isCorrect) {
            const synonymResult = await client.query(`SELECT id FROM vy_words
         WHERE russian = $1 AND english = $2 AND language_id = $3
         LIMIT 1`, [
                word.russian,
                userAnswer,
                word.language_id
            ]);
            synonymWord = synonymResult.rows[0] ?? null;
            isSynonym = Boolean(synonymWord);
        }
        let isPartial = false;
        let hint = "";
        if (!isCorrect && !isSynonym && userAnswer.length > 0) {
            if (correctAnswer.startsWith(userAnswer)) {
                isPartial = true;
                hint = `Correct! Continue... (${correctAnswer.length - userAnswer.length} letters left)`;
            } else if (correctAnswer.includes(userAnswer)) {
                isPartial = true;
                hint = "Partially correct! Try again!";
            } else if (levenshteinDistance(userAnswer, correctAnswer) <= 2) {
                isPartial = true;
                hint = "Very close! Check your answer";
            }
        }
        await client.query(`INSERT INTO vy_answers (word_id, answer, is_correct, is_synonym)
       VALUES ($1, $2, $3, $4)`, [
            wordId,
            userAnswer,
            isCorrect,
            isSynonym
        ]);
        if (isSynonym && synonymWord) {
            const existingCorrect = await client.query(`SELECT id FROM vy_answers WHERE word_id = $1 AND is_correct = true LIMIT 1`, [
                synonymWord.id
            ]);
            if (!existingCorrect.rows[0]) {
                await client.query(`INSERT INTO vy_answers (word_id, answer, is_correct) VALUES ($1, $2, true)`, [
                    synonymWord.id,
                    userAnswer
                ]);
            }
        }
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const todayCorrect = await client.query(`SELECT COUNT(*)::int AS count FROM vy_answers a
       JOIN vy_words w ON w.id = a.word_id
       WHERE a.is_correct = true AND w.language_id = $1
         AND a.created_at >= $2 AND a.created_at <= $3`, [
            word.language_id,
            startOfDay,
            endOfDay
        ]);
        const totalCorrect = await client.query(`SELECT COUNT(*)::int AS count FROM vy_answers a
       JOIN vy_words w ON w.id = a.word_id
       WHERE a.is_correct = true AND w.language_id = $1`, [
            word.language_id
        ]);
        const totalWords = await client.query(`SELECT COUNT(*)::int AS count FROM vy_words WHERE language_id = $1`, [
            word.language_id
        ]);
        const response = {
            isCorrect,
            isPartial,
            hint: isSynonym ? "This is synonym. Try another word." : isPartial ? hint : undefined,
            isSynonym: isSynonym || undefined,
            correctAnswer: word.english,
            todayCorrectAnswers: todayCorrect.rows[0].count,
            totalCorrectAnswers: totalCorrect.rows[0].count,
            totalWords: totalWords.rows[0].count
        };
        await client.query("COMMIT");
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: response
        });
    } catch (error) {
        console.error("Error checking answer:", error);
        await client.query("ROLLBACK");
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: "Failed to check answer"
        }, {
            status: 500
        });
    } finally{
        client.release();
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/web/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "mapRows",
    ()=>mapRows,
    "pool",
    ()=>pool,
    "toCamelCase",
    ()=>toCamelCase,
    "toSnakeCase",
    ()=>toSnakeCase
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$web$2f$node_modules$2f$pg$29$__ = __turbopack_context__.i("[externals]/pg [external] (pg, esm_import, [project]/web/node_modules/pg)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$web$2f$node_modules$2f$pg$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$web$2f$node_modules$2f$pg$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const globalForPg = globalThis;
const pool = globalForPg.vyLangsPool ?? new __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$web$2f$node_modules$2f$pg$29$__["Pool"]({
    connectionString: process.env.DATABASE_URL,
    ssl: ("TURBOPACK compile-time value", "development") === "production" && !process.env.DATABASE_URL?.includes("localhost") ? "TURBOPACK unreachable" : false
});
if ("TURBOPACK compile-time truthy", 1) {
    globalForPg.vyLangsPool = pool;
}
function toSnakeCase(obj) {
    const result = {};
    for (const [key, value] of Object.entries(obj)){
        const snake = key.replace(/[A-Z]/g, (letter)=>`_${letter.toLowerCase()}`);
        if (value !== undefined) {
            result[snake] = value;
        }
    }
    return result;
}
function toCamelCase(row) {
    const result = {};
    for (const [key, value] of Object.entries(row)){
        const camel = key.replace(/_([a-z])/g, (_, letter)=>letter.toUpperCase());
        result[camel] = value;
    }
    return result;
}
function mapRows(rows) {
    return rows.map((row)=>toCamelCase(row));
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0p614hw._.js.map