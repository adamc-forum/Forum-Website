<?php

/* Template Name: Culture */

    // Get fields
        $page = get_fields();
        
        
        // Get contact
            if ($page['contact_module']['contact_point'])
            {
                $page['contact_module']['contact']->fields = get_fields($page['contact_module']['contact']->ID);
                $page['contact_module']['contact']->first_name = explode(' ', $page['contact_module']['contact']->post_title)[0];
                $page['contact_module']['contact']->last_name = explode(' ', $page['contact_module']['contact']->post_title)[1];
            }
            
    // Meta
        global $meta;
               $meta = ['title'			=> $page['meta'][0]['content']['title'],
                           'description'	=> $page['meta'][0]['content']['description'],
                        'image'			=> $page['meta'][0]['image'],
                        'url'			=> '/impact-and-community',
                        'footer'		=> 'grey'];
            
/* Header */
    get_header();

?>

<script type="text/javascript">
    console.log(<?php echo json_encode($page); ?>);
</script>

<div class="bg-container" smoothscroll controller="culture" role="main">
    <section id="culture-hero" scroll="background" background="white" class="culture-background">
        <div class="container">
            <strong class="heading margin fade-up" scroll="reveal">Our Culture</strong>
            <h1 class="h1 pre button diagonal text-reveal" scroll="reveal">Impact and
                                                                            Community</h1>
            
            <div class="flex">
                <p class="para lg fade-up" scroll="reveal"><?=$page['intro_section']['content_blocks']['headline']?></p>
                <div class="para sm fade-up-para-lg" scroll="reveal">
                    <p><?=$page['intro_section']['content_blocks']['body']['body_1']?></p>
                    <p><?=$page['intro_section']['content_blocks']['body']['body_2']?></p>
                </div>
                <figure scroll="parallax" class="fade-up fade-up-para-lg">
                    <img <?=srcset($page['intro_section']['image_1'], 'large')?>
                         sizes="(min-width: 1023px) 46vw, (min-width: 768px) 41vw, 79vw"
                         alt="Impact and Community" class="cover" scroll="image">
                </figure>
            </div>
        </div>
        
        <div class="ticker-outer-container center">
            <img <?=srcset($page['intro_section']['image_2'], '1536x1536')?>
                 alt="Extraorindary Outcomes™" class="cover" scroll="image">		
            <div class="ticker white" scroll="ticker">Extraorindary Outcomes™</div>
        </div>			
    </section>
    
    <section id="culture-team" class="culture-team-impact culture-background" scroll="background" background="white">
        <div class="container">
            <h2 class="h3 text-reveal" scroll="reveal">Our Team</h2>
            <figure scroll="parallax">
                <img <?=srcset($page['our_team']['image'], 'large')?>
                     sizes="(min-width: 1023px) 45vw, (min-width: 768px) 41vw, 80vw"
                     alt="Our Team" class="cover" scroll="image">
            </figure>
            <div class="content">
                <p class="para lg fade-up" scroll="reveal"><?=$page['our_team']['content_blocks']['headline']?></p>
                <p class="para sm fade-up fade-up-para-lg" scroll="reveal"><?=$page['our_team']['content_blocks']['body']?></p>
                
                <a href="/careers" class="button clickable diagonal text-reveal" scroll="reveal">
                    <strong>Learn More
                            About Our
                            Career
                            Opportunities</strong>
                </a>
            </div>
        </div>
    </section>
    
    <section id="culture-impact" class="culture-team-impact culture-background" scroll="background" background="white">
        <div class="container">
            <h2 class="h3 text-reveal" scroll="reveal">Our Impact</h2>
            <figure scroll="parallax">
                <img <?=srcset($page['our_impact']['image'], 'large')?>
                     sizes="(min-width: 768px) 47vw, 80vw"
                     alt="Our Impact" class="cover" scroll="image">
            </figure>
            <div class="content">
                <p class="para lg fade-up" scroll="reveal"><?=$page['our_impact']['content_block_1']['heading']?></p>
                <p class="para sm fade-up fade-up-para-lg" scroll="reveal"><?=$page['our_impact']['content_block_1']['body']?></p>
                
                <a href="<?=$page['our_impact']['content_block_1']['impact_report']['report']?>" class="button clickable diagonal text-reveal" target="_blank" scroll="reveal">
                    <strong><?=$page['our_impact']['content_block_1']['impact_report']['button_text']?></strong>
                </a>
            </div>
            <div class="content">
                <p class="para lg fade-up" scroll="reveal"><?=$page['our_impact']['content_block_2']['heading']?></p>
                <p class="para sm fade-up fade-up-para-lg" scroll="reveal"><?=$page['our_impact']['content_block_2']['body']?></p>
                
                <a 
                href="<?=$page['our_impact']['content_block_2']['esg_policy']['report']['url']?>" 
                target="<?=$page['our_impact']['content_block_2']['esg_policy']['report']['target']?>" 
                class="button clickable diagonal text-reveal" scroll="reveal">
                    <strong><?=$page['our_impact']['content_block_2']['esg_policy']['button_text']?></strong>
                </a>
            </div>
        </div>
    </section>
	
	<div style="position:relative;padding-top:max(50%,324px);margin-bottom: 4rem;width:100%;height:0;"><iframe style="position:absolute;border:none;width:100%;height:100%;left:0;top:0;pointer-events: all;" src="https://online.fliphtml5.com/ccsvh/bhpl/"  seamless="seamless" scrolling="no" frameborder="0" allowtransparency="true" allowfullscreen="true" ></iframe></div>
    
    <section id="culture-philanthropy" scroll="background" background="burgundy" class="culture-background">
        <div class="ticker red" scroll="ticker">Helping To Build Communities</div>
        
        <div class="container">
            <h2 class="h1 pre text-reveal" scroll="reveal">Our
                                                              Philanthropy</h2>
            <div class="images">
                <figure scroll="reveal">
                    <video preload="auto" muted loop playsinline src="<?=$page['our_philanthropy']['video']?>" type="video/mp4" scroll="video"></video>
                </figure>
                <figure scroll="parallax">
                    <img <?=srcset($page['our_philanthropy']['image_2'], 'large')?>
                         sizes="(min-width: 1023px) 25vw, (min-width: 768px) 31vw, 60vw"
                         alt="<?=$page['our_philanthropy']['headline']?>" class="cover" scroll="image">
                </figure>
            </div>
            
            <p class="para lg fade-up" scroll="reveal"><?=$page['our_philanthropy']['content_blocks']['headline']?></p>
            <p class="para sm fade-up fade-up-para-lg" scroll="reveal"><?=$page['our_philanthropy']['content_blocks']['body']?></p>
            
            <div id="charities">
                <p class="para md fade-up fade-up-para-lg" scroll="reveal"><?=$page['our_philanthropy']['charities']['headline']?></p>
                
                <div id="charity-logos">
                    <ul style="--charities: <?=sizeof($page['our_philanthropy']['charities']['charities'])?>">
                        <?php foreach ($page['our_philanthropy']['charities']['charities'] as $charity): ?>
                            <li>
                                <a href="<?=$charity['website']?>" target="_blank" aria-label="<?=$charity['logo']['alt']?>">
                                    <img <?=srcset($charity['logo'], 'medium')?>
                                         sizes="(min-width: 1023px) 15vw, (min-width: 768px) 22vw, 36vw"
                                         alt="<?=$charity['logo']['alt']?>" class="cover" scroll="image">
                                </a>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            </div>
        </div>		
    </section>
    
    
    <?php if ($page['contact_module']['contact_point']): ?>
        <section class="contact photo nlg">
            <div class="container">
                <strong class="h3 fade-up" scroll="reveal"><?=$page['contact_module']['intro']?></strong>
                
                <figure scroll="reveal">
                    <img <?=srcset($page['contact_module']['contact']->fields['photo'], 'large')?>
                         sizes="(min-width: 1023px) 91vw, (min-width: 768px) 47vw, 88vw"
                          alt="<?=$page['contact_module']['contact']->post_title?>" class="cover" scroll="image">
                </figure>
                                            
                <a href="mailto:<?=$page['contact_module']['contact']->fields['content']['email']?>" class="button diagonal text-reveal clickable" scroll="reveal">
                    <strong>Contact
                        <?=$page['contact_module']['contact']->first_name?> 
                        <?=$page['contact_module']['contact']->last_name?></strong>
                </a>

                <p class="para smc pre fade-up fade-up-para-lg" scroll="reveal"><strong><?=$page['contact_module']['contact']->post_title?></strong>
                                        <?=$page['contact_module']['contact']->fields['content']['role']?> 
                                        
                                        <a href="mailto:<?=$page['contact_module']['contact']->fields['content']['email']?>"><?=$page['contact_module']['contact']->fields['content']['email']?></a></p>
                
                <?php if ($page['contact_module']['legal']): ?>
                    <p class="para smc fade-up fade-up-para-lg" id="contact-legal" scroll="reveal"><?=$page['contact_module']['legal']?></p>
                <?php endif; ?>
            </div>
        </section>
    <?php else: ?>
        <section class="contact nlg">
            <div class="container">
                <strong class="h3 fade-up" scroll="reveal"><?=$page['contact_module']['intro']?></strong>
                
                <a href="mailto:<?=$page['contact_module']['email']?>" class="button diagonal text-reveal clickable" scroll="reveal">
                    <strong><?=$page['contact_module']['button_text']?></strong>
                </a>
                
                <?php if ($page['contact_module']['legal']): ?>
                    <p class="para smc fade-up fade-up-para-lg" id="contact-legal" scroll="reveal"><?=$page['contact_module']['legal']?></p>
                <?php endif; ?>
            </div>
        </section>
    <?php endif; ?>
</div>

<?php

get_footer();

?>
