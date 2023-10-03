import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from './helpers/';
import { diskStorage } from 'multer';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('product/:imageName')
  findProductImage( @Res() res: Response, @Param('imageName') imageName: string ){
    const path= this.filesService.getStaticProductImage( imageName );
    return res.sendFile(path)
  }

  @Post('product')
  @UseInterceptors( FileInterceptor('archivo', {
    fileFilter: fileFilter,
    // limits: { fileSize: 1000},
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }) )
  uploadFile( 
    @UploadedFile() file: Express.Multer.File 
    ){

    // console.log({ fileInController: file });
    if( !file ){
      throw new BadRequestException(`Asegurate que el archivo proporcionado es una imagen`)
    }

    const secureUrl= `${ file.filename }`
    
    return {
      secureUrl
    }
  }
}
