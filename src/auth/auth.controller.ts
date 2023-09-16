import { Controller, Post, Body, Get, UseGuards, Req, SetMetadata, Patch, Param, ParseUUIDPipe, Query, Delete, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto,LoginUserDto } from './dto';
import { Auth, GetUser} from './decorators';
import { User } from './entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/dto/pagination.tdo';
import { ValidRoles } from './interfaces';
import { ActivateUserDto } from './dto/activated-user.tdo';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ValidateResetPassword } from './dto/validate-reset-password.dto';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto:CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto:LoginUserDto){
    return this.authService.login(loginUserDto);
  }

  @Get('activate-account')
  @Redirect('https://josue19688.github.io/cca/')
  activateAccount(@Query() activateUserDto: ActivateUserDto) {
    return this.authService.activateUser(activateUserDto);
  }

  @Patch('reset-password')
  resetPassword(
    @Body() resetPasswordDto:ResetPasswordDto
  ){
    return this.authService.resetPasswordToken(resetPasswordDto);
  }

  @Patch('validate-reset-password')
  validatePassword(
    @Body() validateResetPassword:ValidateResetPassword
  ){
    return this.authService.validatePassword(validateResetPassword);
  }


  

  @Get()
  @Auth()
  findAll(@Query() paginatioDto:PaginationDto) {
    return this.authService.findAll(paginatioDto);
  }
  
  @Get('status')
  @Auth()
  checkAuthStatus(
    @GetUser() user:User
  ){
    return this.authService.checkAuthStatus(user);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id', ParseUUIDPipe) id: string,
     @Body() updateUserDto: UpdateUserDto,
     @GetUser() user:User
  ){
    return this.authService.update(id, updateUserDto,user);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.authService.remove(id);
  }


  // @Get('private')
  // @UseGuards(AuthGuard())
  // testingPrivateRouter(
  //   @GetUser() user:User,
  //   @GetUser('email') userMail:User,
  //   @RawHeaders() rawHeaders:string[]
  // ){
  //   return {
  //     ok:true,
  //     msg:'Rutas privadas',
  //     userMail,
  //     user,
  //     rawHeaders
  //   }
  // }


  //@SetMetadata('roles',['admin','user'])

  // @Get('private2')
  // @RoleProtected(ValidRoles.admin,ValidRoles.user)
  // @UseGuards(AuthGuard(),UserRoleGuard)
  // testingPrivateRouter2(
  //   @GetUser() user:User,
  // ){
  //   return {
  //     ok:true,
  //     msg:'Rutas privadas',
  //     user
  //   }
  // }


  // @Get('private3')
  // @Auth()
  // testingPrivateRouter3(
  //   @GetUser() user:User,
  // ){
  //   return {
  //     ok:true,
  //     msg:'Rutas privadas',
  //     user
  //   }
  // }


}
