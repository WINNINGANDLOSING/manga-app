import { Injectable } from '@nestjs/common';
import { CreateMangaDto } from './dto/create-manga.dto';
import { UpdateMangaDto } from './dto/update-manga.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class MangaService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.mangas.findMany({
      include: {
        chapters: {
          include: {
            pages: true,
          },
        },
      },
    });
  }

  async findOne(mangaId: number) {
    return await this.prisma.mangas.findUnique({
      where: {
        id: mangaId,
      },

      include: {
        manga_tag: { include: { tags: true } },
        manga_creator: { include: { creators: true } },
        chapters: {
          include: {
            pages: true,
          },
        },
      },
    });
  }

  async findByTag(tag: string) {
    return await this.prisma.mangas.findMany({
      where: {
        manga_tag: {
          some: {
            tags: {
              name: tag,
            },
          },
        },
      },
      include: {
        manga_tag: true,
      },
    });
  }

  async findByCreator(creator: string) {
    return await this.prisma.mangas.findMany({
      where: {
        manga_creator: {
          some: {
            creators: {
              name: creator,
            },
          },
        },
      },
      include: {
        manga_creator: true,
      },
    });
  }

  async createNewChapter(createChapterDto: CreateChapterDto) {
    const { mangaId, chapterNumber } = createChapterDto;
    try {
      // Auto-generate the chapter number if not provided or invalid
      const lastChapter = await this.prisma.chapters.findFirst({
        where: { manga_id: mangaId },
        orderBy: { chapter_number: 'desc' },
      });

      // const newChapterNumber = chapterNumber
      //   ? new Decimal(chapterNumber).toNumber() // Convert to number before passing to Prisma
      //   : lastChapter
      //     ? new Decimal(lastChapter.chapter_number).plus(1).toNumber() // Convert to number
      //     : 1; // Default to 1
      const newChapterNumber = chapterNumber
        ? chapterNumber
        : lastChapter
          ? 0
          : 1;

      return await this.prisma.chapters.create({
        data: {
          manga_id: mangaId,
          chapter_number: newChapterNumber,
        },
      });
    } catch (error) {
      console.error('Error creating new chapter: ', error);
      throw new Error('Failed to create new chapter');
    }
  }

  // async createNewManga(createMangaDto: CreateMangaDto) {
  //   try {
  //     const {
  //       title,
  //       alternative_titles,
  //       description,
  //       authors,
  //       artists,
  //       originalLanguage,
  //       releaseYear,
  //       origin,
  //       format,
  //       genres,
  //       themes,
  //       cover_image_url,
  //       status,
  //     } = createMangaDto;

  //     const manga = await this.prisma.mangas.create({
  //       data: {
  //         title: title,
  //         description: description,
  //         alternative_titles: alternative_titles,
  //         cover_image_url: cover_image_url,
  //         original_lan: originalLanguage,
  //         release_year: releaseYear,
  //       },
  //     });

  //   const mangaId = manga.id;

  //     return await this.prisma.mangas.create({
  //       data: {
  //         title: title,
  //         description: description,
  //         alternative_titles: alternative_titles,
  //         cover_image_url: cover_image_url,
  //         original_lan: originalLanguage,
  //         release_year: releaseYear,
  //       },
  //     });
  //   } catch (error) {
  //     console.error('Error creating new manga: ', error);
  //     throw new Error('Failed to create new manga');
  //   }
  // }
  // async createNewManga(createMangaDto: CreateMangaDto) {
  //   try {
  //     const {
  //       title,
  //       alternative_titles,
  //       description,
  //       authors, // Array of author names
  //       artists, // Array of artist names
  //       originalLanguage,
  //       releaseYear,
  //       content_rating,
  //       origin,
  //       formats,
  //       genres,
  //       themes,
  //       cover_image_url,
  //     } = createMangaDto;

  //     // Create the manga entry
  //     const manga = await this.prisma.mangas.create({
  //       data: {
  //         title: title,
  //         description: description,
  //         alternative_titles: alternative_titles,
  //         cover_image_url: cover_image_url,
  //         original_lan: originalLanguage,
  //         release_year: releaseYear,
  //         content_rating: content_rating,
  //       },
  //     });

  //     const mangaId = manga.id;

  //     // Create authors and artists in the manga_creator table
  //     const authorPromises = authors.map(async (author) => {
  //       const creator = await this.prisma.creators.upsert({
  //         where: { name: author },
  //         update: {},
  //         create: { name: author },
  //       });

  //       return this.prisma.manga_creator.create({
  //         data: {
  //           manga_id: mangaId,
  //           creator_id: creator.id,
  //           role: 'author',
  //         },
  //       });
  //     });

  //     const artistPromises = artists.map(async (artist) => {
  //       // Insert a new record into table creators if there is no existing record with the field 'name' is equal to artist, if there is, simply do nothing
  //       const creator = await this.prisma.creators.upsert({
  //         where: { name: artist },
  //         update: {},
  //         create: { name: artist },
  //       });

  //       return this.prisma.manga_creator.create({
  //         data: {
  //           manga_id: mangaId,
  //           creator_id: creator.id,
  //           role: 'artist',
  //         },
  //       });
  //     });

  //     // Create genres, themes, format, origin, content rating

  //     // Content Rating
  //     const contentRatingId = await this.prisma.tags.findUnique({
  //       where: { name: content_rating },
  //     });

  //     if (contentRatingId) {
  //       await this.prisma.manga_tag.create({
  //         data: {
  //           manga_id: mangaId,
  //           tag_id: contentRatingId.id,
  //         },
  //       });
  //     }

  //     // Origin
  //     const originTag = await this.prisma.tags.findUnique({
  //       where: { name: origin },
  //     });

  //     if (originTag) {
  //       await this.prisma.manga_tag.create({
  //         data: {
  //           manga_id: mangaId,
  //           tag_id: originTag.id,
  //         },
  //       });
  //     }

  //     // Formats
  //     const formatPromises = formats.map(async (format) => {
  //       const tag = await this.prisma.tags.findUnique({
  //         where: { name: format },
  //       });
  //       return this.prisma.manga_tag.create({
  //         data: {
  //           manga_id: mangaId,
  //           tag_id: tag.id,
  //         },
  //       });
  //     });

  //     // Genres
  //     const genrePromises = genres.map(async (genre) => {
  //       const tag = await this.prisma.tags.findUnique({
  //         where: { name: genre },
  //       });
  //       return this.prisma.manga_tag.create({
  //         data: {
  //           manga_id: mangaId,
  //           tag_id: tag.id,
  //         },
  //       });
  //     });

  //     // Themes
  //     const themePromises = themes.map(async (theme) => {
  //       const tag = await this.prisma.tags.findUnique({
  //         where: { name: theme },
  //       });
  //       return this.prisma.manga_tag.create({
  //         data: {
  //           manga_id: mangaId,
  //           tag_id: tag.id,
  //         },
  //       });
  //     });

  //     // generic function, good to use, but
  //     const processPromises = async (tags: string[], mangaId: number) => {
  //       return Promise.all(
  //         tags.map(async (tagName) => {
  //           const tag = await this.prisma.tags.findUnique({
  //             where: { name: tagName },
  //           });
  //           return this.prisma.manga_tag.create({
  //             data: {
  //               manga_id: mangaId,
  //               tag_id: tag.id,
  //             },
  //           });
  //         }),
  //       );
  //     };

  //     // Wait for all authors and artists to be created
  //     await Promise.all([
  //       ...authorPromises,
  //       ...artistPromises,
  //       ...formatPromises,
  //       ...genrePromises,
  //       ...themePromises,
  //     ]);

  //     return manga;
  //   } catch (error) {
  //     console.error('Error creating new manga: ', error);
  //     throw new Error('Failed to create new manga');
  //   }
  // }

  async createNewManga(createMangaDto: CreateMangaDto) {
    try {
      const {
        title,
        alternative_titles,
        description,
        authors, // Array of author names
        artists, // Array of artist names
        originalLanguage,
        releaseYear,
        content_rating,
        tags,
        cover_image_url,
      } = createMangaDto;
      console.log('in manga ser',title)
      // Create the manga entry
      const manga = await this.prisma.mangas.create({
        data: {
          title: title,
          description: description,
          alternative_titles: alternative_titles,
          cover_image_url: cover_image_url,
          original_lan: originalLanguage,
          release_year: releaseYear,
          content_rating: content_rating,
        },
      });

      const mangaId = manga.id;

      // Create authors and artists in the manga_creator table
      const authorPromises = authors.map(async (author) => {
        const creator = await this.prisma.creators.upsert({
          where: { name: author },
          update: {},
          create: { name: author },
        });

        return this.prisma.manga_creator.create({
          data: {
            manga_id: mangaId,
            creator_id: creator.id,
            role: 'author',
          },
        });
      });

      const artistPromises = artists.map(async (artist) => {
        // Insert a new record into table creators if there is no existing record with the field 'name' is equal to artist, if there is, simply do nothing
        const creator = await this.prisma.creators.upsert({
          where: { name: artist },
          update: {},
          create: { name: artist },
        });

        return this.prisma.manga_creator.create({
          data: {
            manga_id: mangaId,
            creator_id: creator.id,
            role: 'artist',
          },
        });
      });


      // Content Rating
      const contentRatingId = await this.prisma.tags.findUnique({
        where: { name: content_rating },
      });

      if (contentRatingId) {
        await this.prisma.manga_tag.create({
          data: {
            manga_id: mangaId,
            tag_id: contentRatingId.id,
          },
        });
      }

      // Tags
      const tagPromises = tags.map(async (tagName) => {
        const tag = await this.prisma.tags.upsert({
          where: { name: tagName },
          update: {},
          create: {name: tagName}
        });
        // const creator = await this.prisma.creators.upsert({
        //   where: { name: artist },
        //   update: {},
        //   create: { name: artist },
        // });
        return this.prisma.manga_tag.create({
          data: {
            manga_id: mangaId,
            tag_id: tag.id,
          },
        });
      });

      // Wait for all authors and artists to be created
      await Promise.all([...authorPromises, ...artistPromises, ...tagPromises]);

      return manga;
    } catch (error) {
      console.error('Error creating new manga: ', error);
      throw new Error('Failed to create new manga');
    }
  }

  // async createNewManga_ver2(createMangaDto: CreateMangaDto) {
  //   try {
  //     const {
  //       title,
  //       alternative_titles,
  //       description,
  //       authors, // Array of author names
  //       artists, // Array of artist names
  //       originalLanguage,
  //       releaseYear,
  //       content_rating,
  //       tags,
  //       cover_image_url,
  //     } = createMangaDto;

  //     // Create the manga entry
  //     const manga = await this.prisma.mangas.create({
  //       data: {
  //         title: title,
  //         // description: description,
  //         // // alternative_titles: alternative_titles,
  //         // cover_image_url: cover_image_url,
  //         // original_lan: originalLanguage,
  //         // release_year: releaseYear,
  //         // content_rating: content_rating,
  //       },
  //     });

  //     // const mangaId = manga.id;

  //     // // Create authors and artists in the manga_creator table
  //     // const authorPromises = authors.map(async (author) => {
  //     //   const creator = await this.prisma.creators.upsert({
  //     //     where: { name: author },
  //     //     update: {},
  //     //     create: { name: author },
  //     //   });

  //     //   return this.prisma.manga_creator.create({
  //     //     data: {
  //     //       manga_id: mangaId,
  //     //       creator_id: creator.id,
  //     //       role: 'author',
  //     //     },
  //     //   });
  //     // });

  //     // const artistPromises = artists.map(async (artist) => {
  //     //   // Insert a new record into table creators if there is no existing record with the field 'name' is equal to artist, if there is, simply do nothing
  //     //   const creator = await this.prisma.creators.upsert({
  //     //     where: { name: artist },
  //     //     update: {},
  //     //     create: { name: artist },
  //     //   });

  //     //   return this.prisma.manga_creator.create({
  //     //     data: {
  //     //       manga_id: mangaId,
  //     //       creator_id: creator.id,
  //     //       role: 'artist',
  //     //     },
  //     //   });
  //     // });

  //     // // Create genres, themes, format, origin, content rating

  //     // // Content Rating
  //     // const contentRatingId = await this.prisma.tags.findUnique({
  //     //   where: { name: content_rating },
  //     // });

  //     // if (contentRatingId) {
  //     //   await this.prisma.manga_tag.create({
  //     //     data: {
  //     //       manga_id: mangaId,
  //     //       tag_id: contentRatingId.id,
  //     //     },
  //     //   });
  //     // }

  //     // // Formats
  //     // const tagPromises = tags.map(async (tagName) => {
  //     //   const tag = await this.prisma.tags.upsert({
  //     //     where: { name: tagName },
  //     //     update: {},
  //     //     create: {name: tagName}
  //     //   });
  //     //   // const creator = await this.prisma.creators.upsert({
  //     //   //   where: { name: artist },
  //     //   //   update: {},
  //     //   //   create: { name: artist },
  //     //   // });
  //     //   return this.prisma.manga_tag.create({
  //     //     data: {
  //     //       manga_id: mangaId,
  //     //       tag_id: tag.id,
  //     //     },
  //     //   });
  //     // });

  //     // Wait for all authors and artists to be created
  //     // await Promise.all([...authorPromises, ...artistPromises, ...tagPromises]);

  //     return manga;
  //   } catch (error) {
  //     console.error('Error creating new manga: ', error);
  //     throw new Error('Failed to create new manga');
  //   }
  // }

  async editManga(updateMangaDto: UpdateMangaDto) {
    try {
      const {
        manga_id,
        title,
        alternative_titles,
        description,
        creators,
        originalLanguage,
        releaseYear,
        content_rating,
        tags,
        cover_image_url,
        status,
      } = updateMangaDto;

      // Update the manga entry
      const updatedManga = await this.prisma.mangas.update({
        where: { id: Number(manga_id) },
        data: {
          title,
          description,
          cover_image_url,
          original_lan: originalLanguage,
          release_year: releaseYear,
          content_rating,
          status,
          alternative_titles,
          last_updated: new Date().toISOString(),
        },
      });

      const mangaId = updatedManga.id;

      // Update authors and artists in the manga_creator table
      // await this.prisma.manga_creator.deleteMany({
      //   where: { manga_id: mangaId },
      // });
      await this.prisma.manga_creator.deleteMany({
        where: { manga_id: mangaId },
      });

      const creatorPromises = creators?.map(async (author: any) => {
        const creator = await this.prisma.creators.upsert({
          where: { name: author.name },
          update: {},
          create: { name: author.name },
        });

        return this.prisma.manga_creator.create({
          data: {
            manga_id: mangaId,
            creator_id: creator.id,
            role: `${author.role}`,
          },
        });
      });

      // Update tags (content rating, origin, formats, genres, themes)
      // deleting all tags associated with this manga first
      await this.prisma.manga_tag.deleteMany({ where: { manga_id: mangaId } });

      const tagPromises = tags?.map(async (tagName: any) => {
        const tag = await this.prisma.tags.findUnique({
          where: { name: tagName },
        });
        if (tag) {
          return this.prisma.manga_tag.create({
            data: {
              manga_id: mangaId,
              tag_id: tag.id,
            },
          });
        }
      });
      // const processTags = async (tags: string[]) => {
      //   return Promise.all(
      //     tags.map(async (tagName) => {
      //       const tag = await this.prisma.tags.findUnique({
      //         where: { name: tagName },
      //       });
      //       if (tag) {
      //         return this.prisma.manga_tag.create({
      //           data: {
      //             manga_id: mangaId,
      //             tag_id: tag.id,
      //           },
      //         });
      //       }
      //     }),
      //   );
      // };

      // await Promise.all([
      //   processTags([content_rating, origin].filter(Boolean) as string[]),
      //   processTags(formats ?? []),
      //   processTags(genres ?? []),
      //   processTags(themes ?? []),
      //   ...(authorPromises ?? []),
      //   ...(artistPromises ?? []),
      // ]);

      await Promise.all([creatorPromises, tagPromises]);
      return updatedManga;
    } catch (error) {
      console.error('Error updating manga:', error);
      throw new Error('Failed to update manga');
    }
  }

  async getAuthorsAll() {
    return await this.prisma.creators.findMany({});
  }

  getHello(): string {
    return 'Hello World!';
  }
}
