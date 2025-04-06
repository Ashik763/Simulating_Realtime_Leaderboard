"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
// import { prisma } from "../lib/prisma.js";
const prisma_1 = require("@/db/prisma");
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default(); // ioredis instance
function syncRedisToPostgres() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Syncing leaderboard from Redis to PostgreSQL...");
        const scores = yield redis.zrangebyscore("chess_leaderboard", "-inf", "+inf", "WITHSCORES");
        for (let i = 0; i < scores.length; i += 2) {
            const [username, userId] = scores[i].split("|");
            const score = parseInt(scores[i + 1]);
            yield prisma_1.prisma.chessLeaderboard.upsert({
                where: { userId },
                update: { score },
                create: { username, userId, score },
            });
        }
        console.log("Sync complete.");
    });
}
// Schedule the job to run every 5 minutes
node_cron_1.default.schedule("*/5 * * * *", () => {
    syncRedisToPostgres();
});
console.log("Cron job scheduled: Sync Redis to PostgreSQL every 5 minutes.");
