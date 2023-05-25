import os
from fastapi import APIRouter, Depends, HTTPException, status, Response
from services.v1.upload_service import create_dir
from db.base import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import UploadFile, File
route = APIRouter(prefix='/v1/import', tags=['import'])


@route.post('/')
async def upload_estimate(file: list[UploadFile]):

    create_dir()

    return {'fileName': file, 'content_type': file}
