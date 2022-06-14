import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp'
import path from 'path'
// SET STORAGE
var storage = multer.diskStorage( {
  destination: function ( req, file, cb )
  {
    cb( null, 'uploads' )
  },
  filename: function ( req, file, cb )
  {
    cb( null, file.fieldname + '-' + Date.now() )
  }
} )

export const upload = multer( {
  limits: {
    fileSize: 4 * 1024 * 1024,
  }
} )



export class Resize
{
  folder: string
  constructor( folder: string )
  {
    this.folder = folder;
  }
  async save( buffer: Buffer )
  {
    const filename = Resize.filename();
    const filepath = this.filepath( filename );

    await sharp( buffer )
      .resize( 300, 300, { // size image 300x300
        fit: sharp.fit.inside,
        withoutEnlargement: true
      } )
      .toFile( filepath );

    return filename;
  }
  static filename()
  {
    // random file name
    return `${uuidv4()}.png`;
  }
  filepath( filename: string )
  {
    return path.resolve( `${this.folder}/${filename}` )
  }
}



