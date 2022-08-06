-- DropForeignKey
ALTER TABLE `AuthorizorToken` DROP FOREIGN KEY `AuthorizorToken_userId_fkey`;

-- AddForeignKey
ALTER TABLE `AuthorizorToken` ADD CONSTRAINT `AuthorizorToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
