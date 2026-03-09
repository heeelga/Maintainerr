import { Module } from '@nestjs/common';
import { MediaServerModule } from '../api/media-server/media-server.module';
import { ServarrApiModule } from '../api/servarr-api/servarr-api.module';
import { SettingsModule } from '../settings/settings.module';
import { TmdbApiModule } from '../api/tmdb-api/tmdb.module';
import { ArchiveActionHandler } from './archive-action-handler';
import { MediaIdFinder } from './media-id-finder';
import { RadarrActionHandler } from './radarr-action-handler';
import { SonarrActionHandler } from './sonarr-action-handler';

@Module({
  imports: [MediaServerModule, TmdbApiModule, ServarrApiModule, SettingsModule],
  providers: [
    RadarrActionHandler,
    SonarrActionHandler,
    ArchiveActionHandler,
    MediaIdFinder,
  ],
  exports: [RadarrActionHandler, SonarrActionHandler, ArchiveActionHandler],
  controllers: [],
})
export class ActionsModule {}
