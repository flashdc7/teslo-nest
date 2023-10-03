import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors( FileInterceptor('archivo', {
    fileFilter: fileFilter
  }) )
  uploadFile( 
    @UploadedFile() file: Express.Multer.File 
    ){

      // console.log({ fileInController: file });
      if( !file ){
        throw new BadRequestException(`Asegurate que el archivo proporcionado es una imagen`)
      }
      
    return {
      fileName: file.originalname
    }
  }
}
