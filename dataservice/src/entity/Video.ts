import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class Video extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ip: string;

  @Column()
  path: string;

  @Column()
  codec: string;

  @Column()
  resolution: number;

  @Column({ type: 'float' })
  kbps: number;

  @Column({ type: 'float' })
  psnr: number;

  @Column({ type: 'float' })
  psnr_max: number;

  @Column({ type: 'float' })
  psnr_min: number;

  @Column({ type: 'float' })
  ssim: number;

  @Column({ type: 'float' })
  ssim_max: number;

  @Column({ type: 'float' })
  ssim_min: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
  created_at: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
  updated_at: Date;

}
