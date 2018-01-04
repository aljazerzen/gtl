import { Thruster } from './thruster';
import { Circle } from './circle';
import { Rectangle } from './rectangle';

export class BlockId {

  static BLOCKS: BlockId[] = [
    new BlockId('circle', Circle),
    new BlockId('rectangle', Rectangle),
    new BlockId('thruster', Thruster),
  ];

  constructor(public id: string, public block: any) {
  }
}