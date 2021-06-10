import { createConnection, FindManyOptions, Repository } from 'typeorm';

import { Video } from './entity/Video';

export class VideoRepository {
  private repository: Repository<Video> | null = null;

  constructor() {
    this.initConnection();
  }

  private async initConnection() {
    const connection = await createConnection();
    this.repository = connection.getRepository(Video);
  }

  public async add(video: Video) {
    const existing = await this.repository.find({ path: video.path });
    if (existing.length) {
      for (let key in video) existing[0][key] = video[key];
      this.repository.update(existing[0].id, video);
    } else {
      this.repository.save(video);
    }
  }

  public async findAll(options?: FindManyOptions<Video>): Promise<Video[]> {
    return await this.repository.find(options);
  }
};
