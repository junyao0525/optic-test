-- CreateTable
CREATE TABLE "LandoltCResults" (
    "id" BIGSERIAL NOT NULL,
    "session_id" UUID DEFAULT gen_random_uuid(),
    "question_id" DECIMAL,
    "isCorrect" BOOLEAN,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LandoltCResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestSessions" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score" TEXT,
    "result_detail" TEXT,
    "test_type" TEXT,
    "user_id" DECIMAL,

    CONSTRAINT "testSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR,
    "email" VARCHAR,
    "dob" TIMESTAMP(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password" VARCHAR,
    "updatedAt" TIMESTAMPTZ(6),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

