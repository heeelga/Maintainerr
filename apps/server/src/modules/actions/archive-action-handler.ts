import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { MediaServerFactory } from '../api/media-server/media-server.factory';
import { Collection } from '../collections/entities/collection.entities';
import { CollectionMedia } from '../collections/entities/collection_media.entities';
import { MaintainerrLogger } from '../logging/logs.service';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class ArchiveActionHandler {
  constructor(
    private readonly mediaServerFactory: MediaServerFactory,
    private readonly settings: SettingsService,
    private readonly logger: MaintainerrLogger,
  ) {
    logger.setContext(ArchiveActionHandler.name);
  }

  public async handleAction(
    collection: Collection,
    media: CollectionMedia,
  ): Promise<void> {
    const archivePath = this.settings.archivePath;

    if (!archivePath) {
      this.logger.error(
        `Archive action requested but no archive path is configured in settings. No action taken for media ${media.mediaServerId}.`,
      );
      return;
    }

    const mediaServer = await this.mediaServerFactory.getService();
    const itemPath = await mediaServer.getItemPath(media.mediaServerId);

    if (!itemPath) {
      this.logger.error(
        `Could not determine filesystem path for media ${media.mediaServerId}. No archive action taken.`,
      );
      return;
    }

    try {
      // Ensure the archive directory exists
      if (!fs.existsSync(archivePath)) {
        fs.mkdirSync(archivePath, { recursive: true });
      }

      const sourceName = path.basename(itemPath);
      const destination = path.join(archivePath, sourceName);

      // Check if source exists
      if (!fs.existsSync(itemPath)) {
        this.logger.error(
          `Source path '${itemPath}' does not exist. No archive action taken for media ${media.mediaServerId}.`,
        );
        return;
      }

      // Avoid overwriting existing archive entries
      if (fs.existsSync(destination)) {
        this.logger.warn(
          `Archive destination '${destination}' already exists. Skipping archive for media ${media.mediaServerId}.`,
        );
        return;
      }

      // Move the directory/file to the archive location
      fs.renameSync(itemPath, destination);

      this.logger.log(
        `Archived media ${media.mediaServerId} from '${itemPath}' to '${destination}'`,
      );
    } catch (error) {
      // If rename fails (cross-device), try copy + delete
      if ((error as NodeJS.ErrnoException).code === 'EXDEV') {
        try {
          const sourceName = path.basename(itemPath);
          const destination = path.join(archivePath, sourceName);

          await this.copyRecursive(itemPath, destination);
          fs.rmSync(itemPath, { recursive: true, force: true });

          this.logger.log(
            `Archived media ${media.mediaServerId} from '${itemPath}' to '${destination}' (cross-device move)`,
          );
        } catch (copyError) {
          this.logger.error(
            `Failed to archive media ${media.mediaServerId} via copy: ${copyError}`,
          );
        }
      } else {
        this.logger.error(
          `Failed to archive media ${media.mediaServerId}: ${error}`,
        );
      }
    }
  }

  private async copyRecursive(src: string, dest: string): Promise<void> {
    const stat = fs.statSync(src);

    if (stat.isDirectory()) {
      fs.mkdirSync(dest, { recursive: true });
      const entries = fs.readdirSync(src);
      for (const entry of entries) {
        await this.copyRecursive(
          path.join(src, entry),
          path.join(dest, entry),
        );
      }
    } else {
      fs.copyFileSync(src, dest);
    }
  }
}
