import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from './helpers/';
import { diskStorage } from 'multer';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

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

    console.log(file);
    
      
    return {
      fileName: file.originalname
    }
  }
}
