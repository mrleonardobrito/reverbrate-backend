import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ListRepository } from '../interfaces/list-repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { List, ListItem, ListType } from '../entities/list.entity';
import { ListItem as PrismaListItem } from '@prisma/client';
import { TrackRepository } from 'src/tracks/interfaces/track-repository.interface';
import { ArtistRepository } from 'src/artists/interface/artists-repository.interface';
import { AlbumRepository } from 'src/albums/interfaces/album-repository.interface';
import { CreateListRequestDto, UpdateListRequestDto } from '../dto/list-request.dto';
import { PaginatedRequest } from 'src/common/http/dtos/paginated-request.dto';
import { PaginatedResponse } from 'src/common/http/dtos/paginated-response.dto';

@Injectable()
export class PrismaListsRepository implements ListRepository {
  private readonly trackRepository: TrackRepository;
  private readonly artistRepository: ArtistRepository;
  private readonly albumRepository: AlbumRepository;

  constructor(
    @Inject('TrackRepository')
    private readonly tracksRepository: TrackRepository,
    @Inject('ArtistRepository')
    private readonly artistsRepository: ArtistRepository,
    @Inject('AlbumRepository')
    private readonly albumsRepository: AlbumRepository,
    private readonly prisma: PrismaService,
  ) {
    this.trackRepository = tracksRepository;
    this.artistRepository = artistsRepository;
    this.albumRepository = albumsRepository;
  }

  async create(list: CreateListRequestDto, userId: string): Promise<List> {
    const prismaList = await this.prisma.list.create({
      data: {
        name: list.name,
        type: list.type,
        userId: userId,
      },
    });

    return List.create({
      id: prismaList.id,
      name: prismaList.name,
      type: prismaList.type as ListType,
      items: [],
      createdAt: prismaList.createdAt,
      updatedAt: prismaList.updatedAt,
      deletedAt: prismaList.deletedAt ?? null,
    });
  }

  async findById(id: string): Promise<List | null> {
    const prismaList = await this.prisma.list.findUnique({
      where: { id },
    });

    if (!prismaList) return null;

    const prismaItems = await this.prisma.listItem.findMany({
      where: { listId: prismaList.id },
    });

    const type = prismaList.type as ListType;
    let items: ListItem[] = [];
    const itemIds = prismaItems.map((item: PrismaListItem) => item.itemId);

    if (itemIds.length === 0) {
      return List.create({
        id: prismaList.id,
        name: prismaList.name,
        type: prismaList.type as ListType,
        items: [],
        createdAt: prismaList.createdAt,
        updatedAt: prismaList.updatedAt,
        deletedAt: prismaList.deletedAt ?? null,
      });
    }

    switch (type) {
      case ListType.ALBUM:
        items = await this.albumRepository.findManyByIds(itemIds);
        break;
      case ListType.ARTIST:
        items = await this.artistRepository.findManyByIds(itemIds);
        break;
      case ListType.TRACK:
        items = await this.trackRepository.findManyByIds(itemIds);
        break;
      default:
        throw new Error('Invalid list type');
    }

    return List.create({
      id: prismaList.id,
      name: prismaList.name,
      type: prismaList.type as ListType,
      createdAt: prismaList.createdAt,
      updatedAt: prismaList.updatedAt,
      deletedAt: prismaList.deletedAt ?? null,
      items,
    });
  }

  async addItem(listId: string, itemId: string): Promise<void> {
    const existingItem = await this.prisma.listItem.findUnique({
      where: {
        listId_itemId: {
          listId,
          itemId,
        },
      },
    });

    if (existingItem) {
      throw new HttpException('Item already in list', HttpStatus.BAD_REQUEST);
    }

    const lastItem = await this.prisma.listItem.findFirst({
      where: { listId },
      orderBy: { position: 'desc' },
    });

    const position = lastItem ? lastItem.position + 1 : 1;

    await this.prisma.listItem.create({
      data: {
        listId,
        itemId,
        position,
      },
    });
  }

  async removeItem(listId: string, itemId: string): Promise<void> {
    const existingItem = await this.prisma.listItem.findUnique({
      where: {
        listId_itemId: {
          listId,
          itemId,
        },
      },
    });

    if (!existingItem) {
      throw new HttpException('Item not found in list', HttpStatus.NOT_FOUND);
    }

    await this.prisma.listItem.delete({
      where: {
        listId_itemId: {
          listId,
          itemId,
        },
      },
    });
  }

  async findItemById(itemType: ListType, itemId: string): Promise<ListItem | null> {
    switch (itemType) {
      case ListType.ALBUM:
        return this.albumRepository.findById(itemId);
      case ListType.ARTIST:
        return this.artistRepository.findById(itemId);
      case ListType.TRACK:
        return this.trackRepository.findById(itemId);
    }
  }

  async update(listId: string, updateListDto: UpdateListRequestDto): Promise<List> {
    const list = await this.findById(listId);
    if (!list) {
      throw new HttpException('List not found', HttpStatus.NOT_FOUND);
    }
    const updatedList = await this.prisma.list.update({
      where: { id: listId },
      data: updateListDto,
    });

    let items: ListItem[] = [];
    const prismaItems = await this.prisma.listItem.findMany({
      where: { listId },
      orderBy: { position: 'asc' },
    });

    const itemIds = prismaItems.map(item => item.itemId);

    if (itemIds.length > 0) {
      switch (list.type) {
        case ListType.ALBUM:
          items = await this.albumRepository.findManyByIds(itemIds);
          break;
        case ListType.ARTIST:
          items = await this.artistRepository.findManyByIds(itemIds);
          break;
        case ListType.TRACK:
          items = await this.trackRepository.findManyByIds(itemIds);
          break;
      }
    }

    return List.create({
      id: updatedList.id,
      name: updatedList.name,
      type: updatedList.type as ListType,
      items,
      createdAt: list.createdAt,
      updatedAt: list.updatedAt,
      deletedAt: list.deletedAt ?? null,
    });
  }

  async findAll(paginatedRequest: PaginatedRequest): Promise<PaginatedResponse<List>> {
    const prismaLists = await this.prisma.list.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        items: {
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    const lists = await Promise.all(
      prismaLists.map(async prismaList => {
        const itemIds = prismaList.items.map(item => item.itemId);
        let items: ListItem[] = [];

        if (itemIds.length > 0) {
          switch (prismaList.type as ListType) {
            case ListType.ALBUM:
              items = await this.albumRepository.findManyByIds(itemIds);
              break;
            case ListType.ARTIST:
              items = await this.artistRepository.findManyByIds(itemIds);
              break;
            case ListType.TRACK:
              items = await this.trackRepository.findManyByIds(itemIds);
              break;
          }
        }

        return List.create({
          id: prismaList.id,
          name: prismaList.name,
          type: prismaList.type as ListType,
          items,
          createdAt: prismaList.createdAt,
          updatedAt: prismaList.updatedAt,
          deletedAt: prismaList.deletedAt ?? null,
        });
      }),
    );

    return {
      data: lists,
      total: lists.length,
      limit: paginatedRequest.limit,
      next: null,
      offset: paginatedRequest.offset,
      previous: null,
    };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.list.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async like(id: string, userId: string): Promise<void> {
    await this.prisma.listLikes.create({
      data: { listId: id, userId },
    });
  }

  async unlike(id: string, userId: string): Promise<void> {
    await this.prisma.listLikes.delete({
      where: { listId_userId: { listId: id, userId } },
    });
  }

  async alreadyLiked(id: string, userId: string): Promise<boolean> {
    const like = await this.prisma.listLikes.findUnique({
      where: { listId_userId: { listId: id, userId } },
    });
    return !!like;
  }
}
